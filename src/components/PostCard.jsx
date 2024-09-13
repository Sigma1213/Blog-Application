import React, { useState, useEffect } from 'react';
import appwriteService from '../appwrite/config';
import { Link } from 'react-router-dom';

function PostCard({ $id, title, featuredImage }) {
    const [filePreviewUrl, setFilePreviewUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFilePreview = async () => {
            if (!featuredImage) {
                setLoading(false); // No image, so nothing to load
                return;
            }

            try {
                const response = await appwriteService.getFilePreview(featuredImage);
                // If response is a Blob, create an object URL
                if (response instanceof Blob) {
                    setFilePreviewUrl(URL.createObjectURL(response));
                } else {
                    // If response is already a URL
                    setFilePreviewUrl(response);
                }
            } catch (error) {
                console.error('Error fetching file preview:', error);
                setError('Failed to load image');
            } finally {
                setLoading(false);
            }
        };

        fetchFilePreview();
    }, [featuredImage]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <Link to={`/post/${$id}`}>
            <div className='w-full bg-gray-100 rounded-xl p-4'>
                <div className='w-full justify-center mb-4'>
                    {filePreviewUrl ? (
                        <img src={filePreviewUrl} alt={title} className='rounded-xl' />
                    ) : (
                        <p>No image available</p>
                    )}
                </div>
                <h2 className='text-xl font-bold'>{title}</h2>
            </div>
        </Link>
    );
}

export default PostCard;
