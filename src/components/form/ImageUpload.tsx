import { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
    value?: string[];
    onChange: (files: File[], previews: string[]) => void;
    maxFiles?: number;
    maxSizeInMB?: number;
    existingImages?: string[];
    onRemoveExisting?: (index: number) => void;
}

function ImageUpload({
    value = [],
    onChange,
    maxFiles = 5,
    maxSizeInMB = 5,
    existingImages = [],
    onRemoveExisting,
}: ImageUploadProps) {
    const [previews, setPreviews] = useState<string[]>(value);
    const [files, setFiles] = useState<File[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const totalImages = existingImages.length + previews.length;

    const handleFiles = useCallback((newFiles: FileList | null) => {
        if (!newFiles) return;
        
        setError(null);
        const fileArray = Array.from(newFiles);
        
        // Check if adding these files would exceed the limit
        if (totalImages + fileArray.length > maxFiles) {
            setError(`You can only upload up to ${maxFiles} images`);
            return;
        }

        const validFiles: File[] = [];
        const newPreviews: string[] = [];

        fileArray.forEach((file) => {
            // Check file type
            if (!file.type.startsWith('image/')) {
                setError('Only image files are allowed');
                return;
            }

            // Check file size
            if (file.size > maxSizeInMB * 1024 * 1024) {
                setError(`File size must be less than ${maxSizeInMB}MB`);
                return;
            }

            validFiles.push(file);
            newPreviews.push(URL.createObjectURL(file));
        });

        if (validFiles.length > 0) {
            const updatedFiles = [...files, ...validFiles];
            const updatedPreviews = [...previews, ...newPreviews];
            setFiles(updatedFiles);
            setPreviews(updatedPreviews);
            onChange(updatedFiles, updatedPreviews);
        }
    }, [files, previews, onChange, maxFiles, maxSizeInMB, totalImages]);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        handleFiles(e.dataTransfer.files);
    }, [handleFiles]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files);
        // Reset input value so same file can be selected again
        e.target.value = '';
    }, [handleFiles]);

    const removeNewImage = useCallback((index: number) => {
        const newFiles = files.filter((_, i) => i !== index);
        const newPreviews = previews.filter((_, i) => i !== index);
        
        // Revoke the object URL to free memory
        URL.revokeObjectURL(previews[index]);
        
        setFiles(newFiles);
        setPreviews(newPreviews);
        onChange(newFiles, newPreviews);
    }, [files, previews, onChange]);

    return (
        <div className="space-y-4">
            {/* Drop Zone */}
            {totalImages < maxFiles && (
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 ${
                        dragActive
                            ? 'border-brand-500 bg-brand-50'
                            : 'border-gray-300 hover:border-brand-400 hover:bg-gray-50'
                    }`}
                >
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleInputChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center text-center">
                        <div className={`flex h-14 w-14 items-center justify-center rounded-full mb-4 ${
                            dragActive ? 'bg-brand-100 text-brand-600' : 'bg-gray-100 text-gray-500'
                        }`}>
                            <Upload className="h-6 w-6" />
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium text-brand-600">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-400">
                            PNG, JPG, WEBP up to {maxSizeInMB}MB (max {maxFiles} images)
                        </p>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}

            {/* Image Previews */}
            {(existingImages.length > 0 || previews.length > 0) && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {/* Existing Images */}
                    {existingImages.map((url, index) => (
                        <div key={`existing-${index}`} className="relative group aspect-square">
                            <img
                                src={url}
                                alt={`Product image ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg border border-gray-200"
                            />
                            {onRemoveExisting && (
                                <button
                                    type="button"
                                    onClick={() => onRemoveExisting(index)}
                                    className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 text-xs bg-black/50 text-white rounded">
                                Saved
                            </span>
                        </div>
                    ))}
                    
                    {/* New Image Previews */}
                    {previews.map((preview, index) => (
                        <div key={`new-${index}`} className="relative group aspect-square">
                            <img
                                src={preview}
                                alt={`New image ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg border border-brand-200"
                            />
                            <button
                                type="button"
                                onClick={() => removeNewImage(index)}
                                className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 text-xs bg-brand-500 text-white rounded">
                                New
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {existingImages.length === 0 && previews.length === 0 && (
                <div className="flex items-center justify-center py-4 text-gray-400">
                    <ImageIcon className="h-5 w-5 mr-2" />
                    <span className="text-sm">No images uploaded yet</span>
                </div>
            )}
        </div>
    );
}

export default ImageUpload;
