import  { useState } from 'react';
import { Video, Image, X, Play,} from 'lucide-react';

const CreateModules = () => {
  const [moduleName, setModuleName] = useState('');
  const [videos, setVideos] = useState([]);
  const [images, setImages] = useState([]);
  const [learningObjective, setLearningObjective] = useState('');
  const [learningContent, setLearningContent] = useState('');
  const [safeContent, setSafeContent] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newVideos = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      url: URL.createObjectURL(file),
      file: file
    }));
    setVideos([...videos, ...newVideos]);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      url: URL.createObjectURL(file),
      file: file
    }));
    setImages([...images, ...newImages]);
  };

  const removeVideo = (id) => {
    setVideos(videos.filter(v => v.id !== id));
  };

  const removeImage = (id) => {
    setImages(images.filter(img => img.id !== id));
  };

  const handleCreate = () => {
    if (!moduleName.trim()) {
      alert('Please enter a module name');
      return;
    }
    
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      // Reset form
      setModuleName('');
      setVideos([]);
      setImages([]);
      setLearningObjective('');
      setLearningContent('');
      setSafeContent('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
          {/* Module Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Module Name
            </label>
            <input
              type="text"
              value={moduleName}
              onChange={(e) => setModuleName(e.target.value)}
              placeholder="Enter module name"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Video Upload Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Module Overview Videos
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition-colors cursor-pointer bg-gray-50">
              <input
                type="file"
                accept="video/*"
                multiple
                onChange={handleVideoUpload}
                className="hidden"
                id="video-upload"
              />
              <label htmlFor="video-upload" className="cursor-pointer">
                <Video className="w-12 h-12 mx-auto text-purple-500 mb-2" />
                <p className="text-gray-600 font-medium">Upload Videos</p>
                <p className="text-sm text-gray-400 mt-1">Click to select video files</p>
              </label>
            </div>
            
            {videos.length > 0 && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                {videos.map(video => (
                  <div key={video.id} className="relative bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg p-4 group">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-500 rounded-lg p-2">
                        <Play className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{video.name}</p>
                      </div>
                      <button
                        onClick={() => removeVideo(video.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 rounded-full p-1"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Learning Objective */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Learning Objective
            </label>
            <textarea
              value={learningObjective}
              onChange={(e) => setLearningObjective(e.target.value)}
              placeholder="Describe the learning objectives..."
              rows="3"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Learning Content */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Learning Content
            </label>
            <textarea
              value={learningContent}
              onChange={(e) => setLearningContent(e.target.value)}
              placeholder="Enter the learning content details..."
              rows="4"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Upload Pictures
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer bg-gray-50">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Image className="w-12 h-12 mx-auto text-blue-500 mb-2" />
                <p className="text-gray-600 font-medium">Upload Pictures</p>
                <p className="text-sm text-gray-400 mt-1">PNG, JPG up to 10MB</p>
              </label>
            </div>
            
            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                {images.map(img => (
                  <div key={img.id} className="relative group">
                    <img
                      src={img.url}
                      alt={img.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeImage(img.id)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 rounded-full p-1"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Safe Content */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Safe or Not Safe Content
            </label>
            <textarea
              value={safeContent}
              onChange={(e) => setSafeContent(e.target.value)}
              placeholder="Specify content safety guidelines..."
              rows="3"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Create Button */}
          <button
            onClick={handleCreate}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          >
            Create Module
          </button>

          {/* Success Message */}
          {showSuccess && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-2xl p-8 shadow-2xl text-center animate-bounce">
                <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Module Created!</h3>
                <p className="text-gray-600 mt-2">Your module has been successfully created.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateModules;