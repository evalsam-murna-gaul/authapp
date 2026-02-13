import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Need to select the reset fields to update them
    const user = await User.findOne({ email: email.toLowerCase() })
      .select('+resetPasswordToken +resetPasswordExpires');

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        { 
          message: 'If an account exists with this email, you will receive a password reset link.',
        },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Save token to user (expires in 1 hour)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    
    // Important: Mark fields as modified
    user.markModified('resetPasswordToken');
    user.markModified('resetPasswordExpires');
    
    await user.save();

    console.log('Token saved:', {
      email: user.email,
      tokenPreview: resetToken.substring(0, 10) + '...',
      expires: user.resetPasswordExpires
    });

    // In production, you would send an email here
    // For now, we return the token to display on screen
    return NextResponse.json({
      message: 'Password reset link generated successfully!',
      resetToken, // Only for development - remove in production
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}