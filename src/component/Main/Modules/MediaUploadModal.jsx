import { useState } from "react";

const MediaUploadModal = ({ isOpen, onClose, onUpload, mediaType }) => {
  const [file, setFile] = useState(null);
  const [externalUrl, setExternalUrl] = useState("");
  const [uploadMethod, setUploadMethod] = useState("internal"); // "internal" or "external"
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      if (uploadMethod === "internal" && file) {
        // Simulate upload process
        const reader = new FileReader();
        reader.onloadend = () => {
          const uploadedData = {
            url: reader.result,
            publicId: `temp_${Date.now()}`,
            alt: file.name || `${mediaType} file`,
            caption: "",
            duration: mediaType === "video" ? 30 : undefined, // Placeholder duration for videos
          };
          onUpload(uploadedData);
          setUploading(false);
          onClose();
        };
        reader.readAsDataURL(file);
      } else if (uploadMethod === "external" && externalUrl) {
        // External URL provided
        const uploadedData = {
          url: externalUrl,
          publicId: `external_${Date.now()}`,
          alt: `${mediaType} from external URL`,
          caption: "",
          duration: mediaType === "video" ? 30 : undefined, // Placeholder duration for videos
        };
        onUpload(uploadedData);
        setUploading(false);
        onClose();
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploading(false);
      alert("Error uploading media. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="media-upload-modal-title"
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 id="media-upload-modal-title" className="text-lg font-semibold">
            Upload {mediaType === "video" ? "Video" : "Image"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="flex space-x-4 mb-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="uploadMethod"
                  value="internal"
                  checked={uploadMethod === "internal"}
                  onChange={() => setUploadMethod("internal")}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
                  aria-label="Upload file from device"
                />
                <span>Upload File</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="uploadMethod"
                  value="external"
                  checked={uploadMethod === "external"}
                  onChange={() => setUploadMethod("external")}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
                  aria-label="Use external URL"
                />
                <span>External URL</span>
              </label>
            </div>

            {uploadMethod === "internal" ? (
              <div>
                <label
                  htmlFor="media-file-upload"
                  className="block text-sm font-medium mb-2"
                >
                  Select {mediaType === "video" ? "Video" : "Image"} File
                </label>
                <input
                  id="media-file-upload"
                  type="file"
                  accept={mediaType === "video" ? "video/*" : "image/*"}
                  onChange={handleFileChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            ) : (
              <div>
                <label
                  htmlFor="external-url-input"
                  className="block text-sm font-medium mb-2"
                >
                  Enter {mediaType === "video" ? "Video" : "Image"} URL
                </label>
                <input
                  id="external-url-input"
                  type="url"
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
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
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                uploading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={uploading}
            >
              {uploading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Uploading...
                </span>
              ) : (
                "Upload"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MediaUploadModal;
