import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import axios from 'axios';
import { Loader2, Upload, FileText, Download, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { setAuthUser } from '@/redux/authSlice';
import API_URL from '@/config/api';

const EditProfile = () => {
    const imageRef = useRef();
    const resumeRef = useRef();
    const { user } = useSelector(store => store.auth);
    const [loading, setLoading] = useState(false);
    const [resumeLoading, setResumeLoading] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);
    const [input, setInput] = useState({
        profilePhoto: user?.profilePicture || '',
        bio: user?.bio || '',
        gender: user?.gender || '' // Use empty string as default
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) setInput({ ...input, profilePhoto: file });
    }

    const resumeChangeHandler = (e) => {
        const file = e.target.files?.[0];
        
        // Check if file is a PDF
        if (file && file.type !== "application/pdf") {
            toast.error("Only PDF files are allowed");
            return;
        }
        
        setResumeFile(file);
    }

    const selectChangeHandler = (value) => {
        setInput({ ...input, gender: value });
    }

    const uploadResume = async () => {
        if (!resumeFile) {
            toast.error("Please select a PDF file");
            return;
        }
        
        try {
            setResumeLoading(true);
            
            const formData = new FormData();
            formData.append("resume", resumeFile);
            
            const response = await axios.post(
                `${API_URL}/api/v1/user/resume/upload`,
                formData,
                { 
                    withCredentials: true,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            );
            
            if (response.data.success) {
                toast.success("Resume uploaded successfully");
                
                // Update user in Redux
                const updatedUserData = {
                    ...user,
                    resumeUrl: response.data.resumeUrl,
                    resumeName: response.data.resumeName
                };
                dispatch(setAuthUser(updatedUserData));
                
                setResumeFile(null);
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Failed to upload resume");
        } finally {
            setResumeLoading(false);
        }
    };
    
    const deleteResume = async () => {
        try {
            setResumeLoading(true);
            const response = await axios.delete(
                `${API_URL}/api/v1/user/resume/delete`,
                { withCredentials: true }
            );
            
            if (response.data.success) {
                toast.success("Resume deleted successfully");
                
                // Update user in Redux
                const updatedUserData = {
                    ...user,
                    resumeUrl: "",
                    resumeName: ""
                };
                dispatch(setAuthUser(updatedUserData));
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Failed to delete resume");
        } finally {
            setResumeLoading(false);
        }
    };

    const editProfileHandler = async () => {
        const formData = new FormData();
        
        // Only add fields that have valid values
        formData.append("bio", input.bio || "");
        
        // Only append gender if it's a valid value
        if (input.gender && input.gender !== "undefined" && input.gender !== "null") {
            formData.append("gender", input.gender);
        }
        
        if(input.profilePhoto && input.profilePhoto instanceof File){
            formData.append("profilePhoto", input.profilePhoto);
        }
        
        try {
            setLoading(true);
            const res = await axios.post(`${API_URL}/api/v1/user/profile/edit`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            
            if(res.data.success){
                const updatedUserData = {
                    ...user,
                    bio: res.data.user?.bio,
                    profilePicture: res.data.user?.profilePicture,
                    gender: res.data.user?.gender
                };
                dispatch(setAuthUser(updatedUserData));
                navigate(`/profile/${user?._id}`);
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <div className='flex max-w-2xl mx-auto pl-10 h-screen'>
            <section className='flex flex-col gap-6 w-full my-8'>
                <h1 className='font-bold text-xl'>Edit Profile</h1>
                <div className='flex items-center justify-between bg-gray-100 rounded-xl p-4'>
                    <div className='flex items-center gap-3'>
                        <Avatar>
                            <AvatarImage src={user?.profilePicture} alt="profile_image" />
                            <AvatarFallback>{user?.fullName?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className='font-bold text-sm'>{user?.fullName}</h1>
                            <span className='text-gray-600'>{user?.department || 'Bio here...'}</span>
                        </div>
                    </div>
                    <input ref={imageRef} onChange={fileChangeHandler} type='file' className='hidden' />
                    <Button onClick={() => imageRef?.current.click()} className='bg-[#0095F6] h-8 hover:bg-[#318bc7]'>Change photo</Button>
                </div>
                <div>
                    <h1 className='font-bold text-xl mb-2'>Bio</h1>
                    <Textarea value={input.bio} onChange={(e) => setInput({ ...input, bio: e.target.value })} name='bio' className="focus-visible:ring-transparent" />
                </div>
                <div>
                    <h1 className='font-bold mb-2'>Gender</h1>
                    <Select defaultValue={input.gender} onValueChange={selectChangeHandler}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select your Gender"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                
                {/* Resume Upload Section - Only for students and alumni */}
                {user?.role !== "faculty" && (
                    <div className='border p-4 rounded-lg'>
                        <h1 className='font-bold text-xl mb-2'>Resume</h1>
                        <p className='text-gray-600 text-sm mb-4'>Add your resume for others to download from your profile</p>
                        
                        {user?.resumeUrl ? (
                            <div className='bg-gray-100 p-3 rounded-lg flex justify-between items-center'>
                                <div className='flex items-center gap-2'>
                                    <FileText className='text-red-500' />
                                    <span className='text-sm truncate max-w-[180px]'>
                                        {user.resumeName || "Resume.pdf"}
                                    </span>
                                </div>
                                <div className='flex gap-2'>
                                      <a
                                                    href={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(
                                                      user.resumeUrl
                                                    )}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer" 
                                                    className="bg-purple-600 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1 ml-2"
                                                  >
                                                    <FileText size={16} />View
                                                  </a>
                                    <Button 
                                        onClick={() => resumeRef?.current.click()} 
                                        variant='outline' 
                                        size='sm'
                                    >
                                        Replace
                                    </Button>
                                    <Button 
                                        onClick={deleteResume} 
                                        variant='destructive' 
                                        size='sm'
                                        disabled={resumeLoading}
                                    >
                                        <X size={16} />
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center'>
                                <Upload className='text-gray-400 mb-2' />
                                <p className='mb-4 text-gray-600 text-sm'>Upload your resume (PDF only)</p>
                                <input 
                                    ref={resumeRef} 
                                    type='file' 
                                    className='hidden' 
                                    accept='application/pdf' 
                                    onChange={resumeChangeHandler} 
                                />
                                <Button 
                                    onClick={() => resumeRef?.current.click()} 
                                    variant='outline'
                                >
                                    Select PDF File
                                </Button>
                            </div>
                        )}
                        
                        {resumeFile && (
                            <div className='mt-3'>
                                <div className='flex items-center gap-2 mb-2'>
                                    <FileText className='text-red-500' />
                                    <span className='text-sm truncate'>{resumeFile.name}</span>
                                </div>
                                
                                <Button 
                                    onClick={uploadResume} 
                                    disabled={resumeLoading}
                                    className='bg-[#0095F6] hover:bg-[#2a8ccd]'
                                >
                                    {resumeLoading ? (
                                        <>
                                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                            Uploading...
                                        </>
                                    ) : (
                                        "Upload Resume"
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                )}
                
                <div className='flex justify-end'>
                    {
                        loading ? (
                            <Button className='w-fit bg-[#0095F6] hover:bg-[#2a8ccd]'>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                Please wait
                            </Button>
                        ) : (
                            <Button onClick={editProfileHandler} className='w-fit bg-[#0095F6] hover:bg-[#2a8ccd]'>Submit</Button>
                        )
                    }
                </div>
            </section>
        </div>
    )
}

export default EditProfile