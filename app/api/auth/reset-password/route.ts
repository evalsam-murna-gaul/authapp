import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    await connectDB();

    // Hash the token from URL to compare with DB
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    console.log('Looking for token:', {
      tokenPreview: token.substring(0, 10) + '...',
      hashedPreview: hashedToken.substring(0, 10) + '...',
      currentTime: new Date(),
    });

    // Find user with valid token that hasn't expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select('+resetPasswordToken +resetPasswordExpires +password');

    if (!user) {
      // Debug: Check if user exists with this token (even if expired)
      const expiredUser = await User.findOne({
        resetPasswordToken: hashedToken,
      }).select('+resetPasswordToken +resetPasswordExpires');

      console.log('User lookup failed:', {
        foundExpiredToken: !!expiredUser,
        tokenExpiry: expiredUser?.resetPasswordExpires,
      });

      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    console.log('User found, resetting password for:', user.email);

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log('Password reset successful for:', user.email);

    return NextResponse.json({
      message: 'Password reset successful!',
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}