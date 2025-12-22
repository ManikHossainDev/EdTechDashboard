import React, { useState } from "react";

const MediaUploadModal = ({ isOpen, onClose, onUpload, mediaType }) => {
  const [file, setFile] = useState(null);
  const [externalUrl, setExternalUrl] = useState("");
  const [uploadMethod, setUploadMethod] = useState("internal"); // "internal" or "external"

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (uploadMethod === "internal" && file) {
      // Simulate upload process
      const reader = new FileReader();
      reader.onloadend = () => {
        const uploadedData = {
          url: reader.result,
          publicId: `temp_${Date.now()}`,
          duration: mediaType === "video" ? 30 : undefined, // Placeholder duration for videos
        };
        onUpload(uploadedData);
        onClose();
      };
      reader.readAsDataURL(file);
    } else if (uploadMethod === "external" && externalUrl) {
      // External URL provided
      const uploadedData = {
        url: externalUrl,
        publicId: `external_${Date.now()}`,
        duration: mediaType === "video" ? 30 : undefined, // Placeholder duration for videos
      };
      onUpload(uploadedData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Upload {mediaType === "video" ? "Video" : "Image"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="flex space-x-4 mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="uploadMethod"
                  value="internal"
                  checked={uploadMethod === "internal"}
                  onChange={() => setUploadMethod("internal")}
                  className="mr-2"
                />
                Upload File
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="uploadMethod"
                  value="external"
                  checked={uploadMethod === "external"}
                  onChange={() => setUploadMethod("external")}
                  className="mr-2"
                />
                External URL
              </label>
            </div>

            {uploadMethod === "internal" ? (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select {mediaType === "video" ? "Video" : "Image"} File
                </label>
                <input
                  type="file"
                  accept={mediaType === "video" ? "video/*" : "image/*"}
                  onChange={handleFileChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Enter {mediaType === "video" ? "Video" : "Image"} URL
                </label>
                <input
                  type="url"
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder={`https://example.com/${mediaType}.ext`}
                  required
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MediaUploadModal;