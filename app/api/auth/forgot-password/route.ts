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

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { 
          message: 'If an account exists with this email, you will receive a password reset link.',
        },
        { status: 200 }
      );
    }

    console.log('📧 User found:', {
      email: user.email,
      id: user._id,
      currentResetToken: user.resetPasswordToken,
      currentResetExpires: user.resetPasswordExpires
    });

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    console.log('🔐 Generated tokens:', {
      plainToken: resetToken.substring(0, 10) + '...',
      hashedToken: hashedToken.substring(0, 10) + '...'
    });

    // Save token to user (expires in 1 hour)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000);
    
    console.log('💾 Before save:', {
      resetPasswordToken: user.resetPasswordToken?.substring(0, 10) + '...',
      resetPasswordExpires: user.resetPasswordExpires,
      isModified: user.isModified('resetPasswordToken')
    });

    const savedUser = await user.save();
    
    console.log('✅ After save:', {
      resetPasswordToken: savedUser.resetPasswordToken?.substring(0, 10) + '...',
      resetPasswordExpires: savedUser.resetPasswordExpires
    });

    // Wait a moment then verify
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verify it was saved by querying again
    const verifyUser = await User.findById(user._id);
    console.log('🔍 Verification query result:', {
      found: !!verifyUser,
      hasResetToken: !!verifyUser?.resetPasswordToken,
      resetTokenPreview: verifyUser?.resetPasswordToken?.substring(0, 10) + '...',
      expires: verifyUser?.resetPasswordExpires
    });

    // Also try finding by the token
    const tokenSearch = await User.findOne({ resetPasswordToken: hashedToken });
    console.log('🔍 Token search result:', {
      found: !!tokenSearch,
      email: tokenSearch?.email
    });

    return NextResponse.json({
      message: 'Password reset link generated successfully!',
      resetToken,
    });
  } catch (error: any) {
    console.error('❌ Forgot password error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}