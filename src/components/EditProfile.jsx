import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import axios from 'axios';
import { Loader2, MailCheck, MailWarning, FileText, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { setAuthUser } from '@/redux/authSlice';

const EditProfile = () => {
    const imageRef = useRef();
    const resumeRef = useRef();
    const { user } = useSelector(store => store.auth);
    const [loading, setLoading] = useState(false);
    const [emailLoading, setEmailLoading] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [input, setInput] = useState({
        profilePhoto: user?.profilePicture,
        bio: user?.bio,
        gender: user?.gender,
        email: user?.email,
        newEmail: '',
        resume: null,
        currentPassword: '',
    currentPasswordVerified: false,
    newPassword: '',
    confirmPassword: ''
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) setInput({ ...input, profilePhoto: file });
    }

    const resumeChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) setInput({ ...input, resume: file });
    }

    const selectChangeHandler = (value) => {
        setInput({ ...input, gender: value });
    }

    // API call to send email verification
    const sendVerificationEmail = async () => {
        if (!input.newEmail) {
            toast.error('Please enter a new email address');
            return;
        }
        
        try {
            setEmailLoading(true);
            const res = await axios.post(
                'http://localhost:8000/api/v1/user/verify-email',
                { email: input.newEmail },
                { withCredentials: true }
            );
            
            if (res.data.success) {
                toast.success('Verification email sent');
                setVerificationSent(true);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Failed to send verification email');
        } finally {
            setEmailLoading(false);
        }
    }

    // API call to update password
    const updatePassword = async () => {
        if (input.newPassword !== input.confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }
        
        try {
            setLoading(true);
            const res = await axios.post(
                'http://localhost:8000/api/v1/user/change-password',
                {
                    currentPassword: input.currentPassword,
                    newPassword: input.newPassword
                },
                { withCredentials: true }
            );
            
            if (res.data.success) {
                toast.success('Password updated successfully');
                setInput({ ...input, currentPassword: '', newPassword: '', confirmPassword: '' });
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    }

    const editProfileHandler = async () => {
        const formData = new FormData();
        formData.append("bio", input.bio);
        formData.append("gender", input.gender);
        
        // Only append these if they exist
        if (input.profilePhoto) {
            formData.append("profilePhoto", input.profilePhoto);
        }
        if (input.resume) {
            formData.append("resume", input.resume);
        }
        if (input.newEmail && verificationSent) {
            formData.append("email", input.newEmail);
        }

        try {
            setLoading(true);
            // API call to update profile
            const res = await axios.post(
                'http://localhost:8000/api/v1/user/profile/edit',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    withCredentials: true
                }
            );
            
            if (res.data.success) {
                const updatedUserData = {
                    ...user,
                    bio: res.data.user?.bio,
                    profilePicture: res.data.user?.profilePicture,
                    gender: res.data.user.gender,
                    email: res.data.user.email || user.email
                };
                dispatch(setAuthUser(updatedUserData));
                navigate(`/profile/${user?._id}`);
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='flex max-w-2xl mx-auto pl-10 h-screen overflow-y-auto'>
            <section className='flex flex-col gap-6 w-full my-8'>
                <h1 className='font-bold text-xl'>Edit Profile</h1>
                
                {/* Profile Photo Section */}
                <div className='flex items-center justify-between bg-gray-100 rounded-xl p-4'>
                    <div className='flex items-center gap-3'>
                        <Avatar>
                            <AvatarImage src={user?.profilePicture} alt="profile" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className='font-bold text-sm'>{user?.fullName}</h1>
                            <span className='text-gray-600'>{user?.department || 'Bio here...'}</span>
                        </div>
                    </div>
                    <input ref={imageRef} onChange={fileChangeHandler} type='file' accept='image/*' className='hidden' />
                    <Button onClick={() => imageRef?.current.click()} className='bg-[#0095F6] h-8 hover:bg-[#318bc7]'>Change photo</Button>
                </div>
                
                {/* Bio Section */}
                <div>
                    <h1 className='font-bold text-xl mb-2'>Bio</h1>
                    <Textarea 
                        value={input.bio} 
                        onChange={(e) => setInput({ ...input, bio: e.target.value })} 
                        name='bio' 
                        className="focus-visible:ring-transparent" 
                        placeholder="Tell others about yourself..."
                    />
                </div>
                
                {/* Gender Section */}
                <div>
                    <h1 className='font-bold mb-2'>Gender</h1>
                    <Select defaultValue={input.gender} onValueChange={selectChangeHandler}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                
                {/* Email Update Section */}
                {/* <div>
                    <h1 className='font-bold text-xl mb-2'>Email</h1>
                    <div className='flex items-center gap-2 mb-2'>
                        <span className='text-gray-600'>Current: {user?.email}</span>
                        {user?.emailVerified ? (
                            <span className='text-green-500 flex items-center gap-1'>
                                <MailCheck size={16} /> Verified
                            </span>
                        ) : (
                            <span className='text-yellow-500 flex items-center gap-1'>
                                <MailWarning size={16} /> Not verified
                            </span>
                        )}
                    </div>
                    <div className='flex gap-2'>
                        <Input
                            type="email"
                            value={input.newEmail}
                            onChange={(e) => setInput({ ...input, newEmail: e.target.value })}
                            placeholder="Enter new email"
                            className="flex-1"
                        />
                        <Button 
                            onClick={sendVerificationEmail}
                            disabled={!input.newEmail || emailLoading}
                            className='bg-[#0095F6] hover:bg-[#318bc7]'
                        >
                            {emailLoading ? (
                                <Loader2 className='h-4 w-4 animate-spin' />
                            ) : (
                                'Verify Email'
                            )}
                        </Button>
                    </div>
                    {verificationSent && (
                        <p className='text-sm text-green-500 mt-1'>Verification email sent. Please check your inbox.</p>
                    )}
                </div> */}
                
                {/* Resume Upload Section */}
                <div>
                    <h1 className='font-bold text-xl mb-2'>Resume</h1>
                    <div className='flex items-center gap-2'>
                        <input 
                            ref={resumeRef} 
                            onChange={resumeChangeHandler} 
                            type='file' 
                            accept='.pdf,.doc,.docx' 
                            className='hidden' 
                        />
                        <Button 
                            onClick={() => resumeRef?.current.click()} 
                            variant="outline"
                            className='flex items-center gap-2'
                        >
                            <FileText size={16} />
                            {input.resume ? input.resume.name : 'Upload Resume'}
                        </Button>
                        {input.resume && (
                            <span className='text-sm text-gray-500'>{Math.round(input.resume.size / 1024)} KB</span>
                        )}
                    </div>
                    <p className='text-sm text-gray-500 mt-1'>Accepted formats: PDF, DOC, DOCX</p>
                </div>
                
                {/* Password Change Section */}
                <div>
                    <h1 className='font-bold text-xl mb-2'>Change Password</h1>
                    <div className='space-y-3'>
                        <div className='relative'>
                            <Input
                                type= "password"
                                value={input.currentPassword}
                                onChange={(e) => setInput({ ...input, currentPassword: e.target.value })}
                                placeholder="Current password"
                            />
                        </div>
                        <Input
                            type={showPassword ? "text" : "password"}
                            value={input.newPassword}
                            onChange={(e) => setInput({ ...input, newPassword: e.target.value })}
                            placeholder="New password"
                        />
                        <Input
                            type={showPassword ? "text" : "password"}
                            value={input.confirmPassword}
                            onChange={(e) => setInput({ ...input, confirmPassword: e.target.value })}
                            placeholder="Confirm new password"
                        />
                        <Button 
                            onClick={updatePassword}
                            disabled={!input.currentPassword || !input.newPassword || !input.confirmPassword}
                            className='bg-[#0095F6] hover:bg-[#318bc7]'
                        >
                            Update Password
                        </Button>
                    </div>
                </div>
                
                {/* Submit Button */}
                <div className='flex justify-end'>
                    {loading ? (
                        <Button className='w-fit bg-[#0095F6] hover:bg-[#2a8ccd]'>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Please wait
                        </Button>
                    ) : (
                        <Button onClick={editProfileHandler} className='w-fit bg-[#0095F6] hover:bg-[#2a8ccd]'>Save Changes</Button>
                    )}
                </div>
            </section>
        </div>
    )
}

export default EditProfile;

