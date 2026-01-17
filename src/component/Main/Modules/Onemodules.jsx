import { useState, useEffect } from "react";
import {
  useGetModulesByIdQuery,
  useUpdateModulesOneMutation,
  useUploadContentImageMutation,
  useUploadIntroVideoOrCoverImageMutation,
} from "../../../redux/features/modules/modulesGet";

const Onemodules = () => {
  // module id one
  const id = "695b946312423eb787bb458d";
  const { data, isLoading, isError, error } = useGetModulesByIdQuery(id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateModuleOne] = useUpdateModulesOneMutation();
  const [uploadGenImage] = useUploadContentImageMutation();
  const [uploadIntroVideo] = useUploadIntroVideoOrCoverImageMutation();

  // Initialize form state with module data
  const [formData, setFormData] = useState({
    moduleNumber: 1,
    title: "",
    slug: "",
    theme: "",
    description: "",
    learningObjectives: [{ text: "", order: 1 }],
    learningContent: [],
    interactiveTasks: [],
    quiz: {
      title: "",
      description: "",
      passingScore: 75,
      questions: [],
      totalPoints: 0,
      allowRetake: true,
      showCorrectAnswers: true,
    },
    parentTip: {
      title: "",
      content: "",
      additionalResources: [],
    },
    status: "draft",
    order: 1,
    introVideo: {},
  });

  // Update form data when module data loads
  useEffect(() => {
    if (data) {
      setFormData({
        moduleNumber: data.moduleNumber,
        title: data.title || "",
        slug: data.slug || "",
        theme: data.theme || "",
        description: data.description || "",
        learningObjectives: data.learningObjectives || [{ text: "", order: 1 }],
        learningContent: data.learningContent || [],
        interactiveTasks: data.interactiveTasks || [],
        quiz: {
          title: data.quiz?.title || "",
          description: data.quiz?.description || "",
          passingScore: data.quiz?.passingScore || 75,
          questions: data.quiz?.questions || [],
          totalPoints: data.quiz?.totalPoints || 0,
          allowRetake:
            data.quiz?.allowRetake !== undefined ? data.quiz.allowRetake : true,
          showCorrectAnswers:
            data.quiz?.showCorrectAnswers !== undefined
              ? data.quiz.showCorrectAnswers
              : true,
        },
        parentTip: {
          title: data.parentTip?.title || "",
          content: data.parentTip?.content || "",
          additionalResources: data.parentTip?.additionalResources || [],
        },
        status: data.status || "draft",
        order: data.order || 1,
        introVideo: data.introVideo || {},
      });
    }
  }, [data]);

  // Handle intro video upload
  const handleIntroVideoUpload = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "video/*";
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setIsSubmitting(true);
      try {
        const formData = new FormData();
        formData.append("introVideo", file);

        const response = await uploadIntroVideo({
          moduleId: id,
          body: formData,
        }).unwrap();

        // Update the form data with the new video info
        setFormData((prev) => ({
          ...prev,
          introVideo: response.introVideo,
        }));

        alert("Intro video uploaded successfully!");
      } catch (error) {
        console.error("Video upload error:", error);
        alert("Failed to upload video");
      } finally {
        setIsSubmitting(false);
      }
    };
    fileInput.click();
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      // Deep clone the state to avoid issues with frozen objects
      const clonedPrev = JSON.parse(JSON.stringify(prev));
      return {
        ...clonedPrev,
        [field]: value,
      };
    });
  };

  // Handle nested field changes
  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => {
      // Deep clone the state to avoid issues with frozen objects
      const clonedPrev = JSON.parse(JSON.stringify(prev));
      return {
        ...clonedPrev,
        [section]: {
          ...clonedPrev[section],
          [field]: value,
        },
      };
    });
  };

  // Handle learning objectives changes
  const handleLearningObjectiveChange = (index, field, value) => {
    setFormData((prev) => {
      // Deep clone the state to avoid issues with frozen objects
      const clonedPrev = JSON.parse(JSON.stringify(prev));
      const updatedObjectives = [...clonedPrev.learningObjectives];
      updatedObjectives[index] = { ...updatedObjectives[index], [field]: value };
      return {
        ...clonedPrev,
        learningObjectives: updatedObjectives,
      };
    });
  };

  const addLearningObjective = () => {
    setFormData((prev) => {
      // Deep clone the state to avoid issues with frozen objects
      const clonedPrev = JSON.parse(JSON.stringify(prev));
      return {
        ...clonedPrev,
        learningObjectives: [
          ...clonedPrev.learningObjectives,
          { text: "", order: clonedPrev.learningObjectives.length + 1 },
        ],
      };
    });
  };

  const removeLearningObjective = (index) => {
    setFormData((prev) => {
      // Deep clone the state to avoid issues with frozen objects
      const clonedPrev = JSON.parse(JSON.stringify(prev));
      const updatedObjectives = clonedPrev.learningObjectives.filter(
        (_, i) => i !== index
      );
      return {
        ...clonedPrev,
        learningObjectives: updatedObjectives,
      };
    });
  };

  // Handle content blocks changes
  const handleContentBlockChange = (index, field, value) => {
    setFormData((prev) => {
      // Deep clone the state to avoid issues with frozen objects
      const clonedPrev = JSON.parse(JSON.stringify(prev));
      const updatedContent = [...clonedPrev.learningContent];
      updatedContent[index] = { ...updatedContent[index], [field]: value };
      return {
        ...clonedPrev,
        learningContent: updatedContent,
      };
    });
  };

  const addContentBlock = () => {
    setFormData((prev) => {
      // Deep clone the state to avoid issues with frozen objects
      const clonedPrev = JSON.parse(JSON.stringify(prev));
      return {
        ...clonedPrev,
        learningContent: [
          ...clonedPrev.learningContent,
          { type: "text", order: clonedPrev.learningContent.length, content: "" },
        ],
      };
    });
  };

  const removeContentBlock = (index) => {
    setFormData((prev) => {
      // Deep clone the state to avoid issues with frozen objects
      const clonedPrev = JSON.parse(JSON.stringify(prev));
      const updatedContent = clonedPrev.learningContent.filter((_, i) => i !== index);
      return {
        ...clonedPrev,
        learningContent: updatedContent,
      };
    });
  };

  // Handle image upload for content blocks
  const handleImageUpload = async (index) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      setIsSubmitting(true);
      try {
        const formData = new FormData();
        formData.append("image", file);
        const imageUrl = await uploadGenImage(formData).unwrap();
        // Update the content block with the new image URL
        setFormData((prev) => {
          // Deep clone the state to avoid issues with frozen objects
          const clonedPrev = JSON.parse(JSON.stringify(prev));
          const updatedContent = [...clonedPrev.learningContent];
          if (!updatedContent[index].image) {
            updatedContent[index].image = {};
          }
          updatedContent[index] = {
            ...updatedContent[index],
            image: {
              ...updatedContent[index].image,
              url: imageUrl,
              publicId: imageUrl.split("/").pop(), // Simplified publicId extraction
            },
          };

          return {
            ...clonedPrev,
            learningContent: updatedContent,
          };
        });
      } catch (error) {
        console.error("Image upload error:", error);
        alert("Failed to upload image");
      } finally {
        setIsSubmitting(false);
      }
    };
    fileInput.click();
  };

  // Handle quiz question changes
  const handleQuizQuestionChange = (index, field, value) => {
    setFormData((prev) => {
      // Deep clone the state to avoid issues with frozen objects
      const clonedPrev = JSON.parse(JSON.stringify(prev));
      const updatedQuestions = [...clonedPrev.quiz.questions];
      updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
      return {
        ...clonedPrev,
        quiz: {
          ...clonedPrev.quiz,
          questions: updatedQuestions,
        },
      };
    });
  };

  // Handle quiz option changes
  const handleQuizOptionChange = (questionIndex, optionIndex, field, value) => {
    setFormData((prev) => {
      // Deep clone the state to avoid issues with frozen objects
      const clonedPrev = JSON.parse(JSON.stringify(prev));
      const updatedQuestions = [...clonedPrev.quiz.questions];
      const updatedOptions = [...updatedQuestions[questionIndex].options];

      if (field === "isCorrect" && value) {
        // If this option is being marked as correct, unmark all others
        updatedOptions.forEach((opt, idx) => {
          if (idx !== optionIndex) {
            opt.isCorrect = false;
          }
        });
        // Update the correctAnswer field
        updatedQuestions[questionIndex].correctAnswer =
          updatedOptions[optionIndex].id;
      }

      updatedOptions[optionIndex] = {
        ...updatedOptions[optionIndex],
        [field]: value,
      };
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        options: updatedOptions,
      };
      return {
        ...clonedPrev,
        quiz: {
          ...clonedPrev.quiz,
          questions: updatedQuestions,
        },
      };
    });
  };

  const addQuizQuestion = () => {
    setFormData((prev) => {
      // Deep clone the state to avoid issues with frozen objects
      const clonedPrev = JSON.parse(JSON.stringify(prev));
      const newQuestionNumber = clonedPrev.quiz.questions.length + 1;
      return {
        ...clonedPrev,
        quiz: {
          ...clonedPrev.quiz,
          questions: [
            ...clonedPrev.quiz.questions,
            {
              questionNumber: newQuestionNumber,
              type: "multiple-choice",
              question: "",
              options: [
                { id: "A", text: "", isCorrect: false },
                { id: "B", text: "", isCorrect: false },
                { id: "C", text: "", isCorrect: false },
                { id: "D", text: "", isCorrect: false },
              ],
              correctAnswer: "",
              explanation: "",
              points: 0,
            },
          ],
        },
      };
    });
  };

  const removeQuizQuestion = (index) => {
    setFormData((prev) => {
      // Deep clone the state to avoid issues with frozen objects
      const clonedPrev = JSON.parse(JSON.stringify(prev));
      const updatedQuestions = clonedPrev.quiz.questions.filter(
        (_, i) => i !== index
      );
      return {
        ...clonedPrev,
        quiz: {
          ...clonedPrev.quiz,
          questions: updatedQuestions,
        },
      };
    });
  };

  const addQuizOption = (questionIndex) => {
    setFormData((prev) => {
      // Deep clone the state to avoid issues with frozen objects
      const clonedPrev = JSON.parse(JSON.stringify(prev));
      const updatedQuestions = [...clonedPrev.quiz.questions];
      const currentOptions = updatedQuestions[questionIndex].options;
      const newOptionId = String.fromCharCode(65 + currentOptions.length); // A, B, C, D...
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        options: [
          ...currentOptions,
          { id: newOptionId, text: "", isCorrect: false },
        ],
      };
      return {
        ...clonedPrev,
        quiz: {
          ...clonedPrev.quiz,
          questions: updatedQuestions,
        },
      };
    });
  };

  const removeQuizOption = (questionIndex, optionIndex) => {
    setFormData((prev) => {
      // Deep clone the state to avoid issues with frozen objects
      const clonedPrev = JSON.parse(JSON.stringify(prev));
      const updatedQuestions = [...clonedPrev.quiz.questions];
      const updatedOptions = updatedQuestions[questionIndex].options.filter(
        (_, i) => i !== optionIndex
      );
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        options: updatedOptions,
      };
      return {
        ...clonedPrev,
        quiz: {
          ...clonedPrev.quiz,
          questions: updatedQuestions,
        },
      };
    });
  };

  // Handle interactive task changes
  const handleInteractiveTaskChange = (index, field, value) => {
    setFormData((prev) => {
      // Deep clone the state to avoid issues with frozen objects
      const clonedPrev = JSON.parse(JSON.stringify(prev));
      const updatedTasks = [...clonedPrev.interactiveTasks];
      updatedTasks[index] = { ...updatedTasks[index], [field]: value };
      return {
        ...clonedPrev,
        interactiveTasks: updatedTasks,
      };
    });
  };

  // Handle drag-drop task items
  const handleDragDropItemChange = (taskIndex, itemIndex, field, value) => {
    setFormData((prev) => {
      // Deep clone the state to avoid issues with frozen objects
      const clonedPrev = JSON.parse(JSON.stringify(prev));
      const updatedTasks = [...clonedPrev.interactiveTasks];
      if (!updatedTasks[taskIndex].config.items) {
        updatedTasks[taskIndex].config.items = [];
      }
      const updatedItems = [...updatedTasks[taskIndex].config.items];
      updatedItems[itemIndex] = { ...updatedItems[itemIndex], [field]: value };
      updatedTasks[taskIndex] = {
        ...updatedTasks[taskIndex],
        config: {
          ...updatedTasks[taskIndex].config,
          items: updatedItems,
        },
      };
      return {
        ...clonedPrev,
        interactiveTasks: updatedTasks,
      };
    });
  };

  const addDragDropItem = (taskIndex) => {
    setFormData((prev) => {
      // Deep clone the state to avoid issues with frozen objects
      const clonedPrev = JSON.parse(JSON.stringify(prev));
      const updatedTasks = [...clonedPrev.interactiveTasks];
      if (!updatedTasks[taskIndex].config.items) {
        updatedTasks[taskIndex].config.items = [];
      }
      const newItemId = (
        updatedTasks[taskIndex].config.items.length + 1
      ).toString();
      updatedTasks[taskIndex] = {
        ...updatedTasks[taskIndex],
        config: {
          ...updatedTasks[taskIndex].config,
          items: [
            ...updatedTasks[taskIndex].config.items,
            { id: newItemId, text: "", image: {} },
          ],
        },
      };
      return {
        ...clonedPrev,
        interactiveTasks: updatedTasks,
      };
    });
  };

  const removeDragDropItem = (taskIndex, itemIndex) => {
    setFormData((prev) => {
      // Deep clone the state to avoid issues with frozen objects
      const clonedPrev = JSON.parse(JSON.stringify(prev));
      const updatedTasks = [...clonedPrev.interactiveTasks];
      const updatedItems = updatedTasks[taskIndex].config.items.filter(
        (_, i) => i !== itemIndex
      );
      updatedTasks[taskIndex] = {
        ...updatedTasks[taskIndex],
        config: {
          ...updatedTasks[taskIndex].config,
          items: updatedItems,
        },
      };
      return {
        ...clonedPrev,
        interactiveTasks: updatedTasks,
      };
    });
  };

  // Handle drag-drop task categories
  const handleDragDropCategoryChange = (
    taskIndex,
    categoryIndex,
    field,
    value
  ) => {
    setFormData((prev) => {
      // Deep clone the state to avoid issues with frozen objects
      const clonedPrev = JSON.parse(JSON.stringify(prev));
      const updatedTasks = [...clonedPrev.interactiveTasks];
      if (!updatedTasks[taskIndex].config.categories) {
        updatedTasks[taskIndex].config.categories = [];
      }
      const updatedCategories = [...updatedTasks[taskIndex].config.categories];
      updatedCategories[categoryIndex] = {
        ...updatedCategories[categoryIndex],
        [field]: value,
      };
      updatedTasks[taskIndex] = {
        ...updatedTasks[taskIndex],
        config: {
          ...updatedTasks[taskIndex].config,
          categories: updatedCategories,
        },
      };
      return {
        ...clonedPrev,
        interactiveTasks: updatedTasks,
      };
    });
  };

  const addDragDropCategory = (taskIndex) => {
    setFormData((prev) => {
      // Deep clone the state to avoid issues with frozen objects
      const clonedPrev = JSON.parse(JSON.stringify(prev));
      const updatedTasks = [...clonedPrev.interactiveTasks];
      if (!updatedTasks[taskIndex].config.categories) {
        updatedTasks[taskIndex].config.categories = [];
      }
      const newCategoryId = `category-${
        updatedTasks[taskIndex].config.categories.length + 1
      }`;
      updatedTasks[taskIndex] = {
        ...updatedTasks[taskIndex],
        config: {
          ...updatedTasks[taskIndex].config,
          categories: [
            ...updatedTasks[taskIndex].config.categories,
            { id: newCategoryId, name: "", description: "" },
          ],
        },
      };
      return {
        ...clonedPrev,
        interactiveTasks: updatedTasks,
      };
    });
  };

  const removeDragDropCategory = (taskIndex, categoryIndex) => {
    setFormData((prev) => {
      // Deep clone the state to avoid issues with frozen objects
      const clonedPrev = JSON.parse(JSON.stringify(prev));
      const updatedTasks = [...clonedPrev.interactiveTasks];
      const updatedCategories = updatedTasks[
        taskIndex
      ].config.categories.filter((_, i) => i !== categoryIndex);
      updatedTasks[taskIndex] = {
        ...updatedTasks[taskIndex],
        config: {
          ...updatedTasks[taskIndex].config,
          categories: updatedCategories,
        },
      };
      return {
        ...clonedPrev,
        interactiveTasks: updatedTasks,
      };
    });
  };

  // Handle image upload for drag-drop items
  const handleDragDropItemImageUpload = async (taskIndex, itemIndex) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setIsSubmitting(true);
      try {
        const formData = new FormData();
        formData.append("image", file);

        const imageUrl = await uploadGenImage(formData).unwrap();

        // Update the drag-drop item with the new image URL
        setFormData((prev) => {
          // Deep clone the state to avoid issues with frozen objects
          const clonedPrev = JSON.parse(JSON.stringify(prev));
          const updatedTasks = [...clonedPrev.interactiveTasks];
          if (!updatedTasks[taskIndex].config.items[itemIndex].image) {
            updatedTasks[taskIndex].config.items[itemIndex].image = {};
          }
          const updatedItems = [...updatedTasks[taskIndex].config.items];
          updatedItems[itemIndex] = {
            ...updatedItems[itemIndex],
            image: {
              ...updatedItems[itemIndex].image,
              url: imageUrl,
              publicId: imageUrl.split("/").pop(),
            },
          };
          updatedTasks[taskIndex] = {
            ...updatedTasks[taskIndex],
            config: {
              ...updatedTasks[taskIndex].config,
              items: updatedItems,
            },
          };

          return {
            ...clonedPrev,
            interactiveTasks: updatedTasks,
          };
        });
      } catch (error) {
        console.error("Image upload error:", error);
        alert("Failed to upload image");
      } finally {
        setIsSubmitting(false);
      }
    };
    fileInput.click();
  };

  // Handle image upload for drag-drop categories
  const handleDragDropCategoryImageUpload = async (taskIndex, categoryIndex) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setIsSubmitting(true);
      try {
        const formData = new FormData();
        formData.append("image", file);

        const imageUrl = await uploadGenImage(formData).unwrap();

        // Update the drag-drop category with the new image URL
        setFormData((prev) => {
          // Deep clone the state to avoid issues with frozen objects
          const clonedPrev = JSON.parse(JSON.stringify(prev));
          const updatedTasks = [...clonedPrev.interactiveTasks];
          if (!updatedTasks[taskIndex].config.categories[categoryIndex].image) {
            updatedTasks[taskIndex].config.categories[categoryIndex].image = {};
          }
          const updatedCategories = [...updatedTasks[taskIndex].config.categories];
          updatedCategories[categoryIndex] = {
            ...updatedCategories[categoryIndex],
            image: {
              ...updatedCategories[categoryIndex].image,
              url: imageUrl,
              publicId: imageUrl.split("/").pop(),
            },
          };
          updatedTasks[taskIndex] = {
            ...updatedTasks[taskIndex],
            config: {
              ...updatedTasks[taskIndex].config,
              categories: updatedCategories,
            },
          };

          return {
            ...clonedPrev,
            interactiveTasks: updatedTasks,
          };
        });
      } catch (error) {
        console.error("Image upload error:", error);
        alert("Failed to upload image");
      } finally {
        setIsSubmitting(false);
      }
    };
    fileInput.click();
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare the updated data in the required format
      const updatedData = {
        ...formData,
        // Ensure moduleNumber and order are not changed
        moduleNumber: data?.moduleNumber || formData.moduleNumber,
        order: data?.order || formData.order,
      };

      await updateModuleOne({ id, updatedData }).unwrap();
      alert("Module updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update module");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (isError)
    return <div className="p-6 text-red-500">Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Edit Module: {formData.title}</h2>

      <form onSubmit={handleSubmit}>
        {/* Module Information Section */}
        <div className="mb-8 p-4 border rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Module Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Module Number (Read-only)
              </label>
              <input
                type="text"
                value={formData.moduleNumber}
                readOnly
                className="w-full px-3 py-2 border rounded bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Order (Read-only)
              </label>
              <input
                type="text"
                value={formData.order}
                readOnly
                className="w-full px-3 py-2 border rounded bg-gray-100"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Slug
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => handleInputChange("slug", e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Theme
            </label>
            <input
              type="text"
              value={formData.theme}
              onChange={(e) => handleInputChange("theme", e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows="3"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Intro Video Section */}
        <div className="mb-8 p-4 border rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Intro Video</h3>

          <div className="mb-4">
            {formData.introVideo?.url ? (
              <div className="mb-4">
                <video
                  controls
                  className="w-full max-w-md h-auto rounded border"
                >
                  <source src={formData.introVideo.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              <p className="text-gray-500 italic">No intro video uploaded</p>
            )}

            <button
              type="button"
              onClick={handleIntroVideoUpload}
              disabled={isSubmitting}
              className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Uploading..." : "Upload/Edit Intro Video"}
            </button>
          </div>
        </div>

        {/* Learning Objectives Section */}
        <div className="mb-8 p-4 border rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Learning Objectives</h3>
            <button
              type="button"
              onClick={addLearningObjective}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
            >
              Add Objective
            </button>
          </div>

          {formData.learningObjectives.map((objective, index) => (
            <div
              key={index}
              className="mb-4 p-3 border rounded flex items-start"
            >
              <div className="flex-1 mr-2">
                <label className="block text-gray-700 text-sm font-bold mb-1">
                  Objective {index + 1}
                </label>
                <input
                  type="text"
                  value={objective.text}
                  onChange={(e) =>
                    handleLearningObjectiveChange(index, "text", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter learning objective"
                />
              </div>

              <div className="mr-2">
                <label className="block text-gray-700 text-sm font-bold mb-1">
                  Order
                </label>
                <input
                  type="number"
                  value={objective.order}
                  onChange={(e) =>
                    handleLearningObjectiveChange(
                      index,
                      "order",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-16 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="button"
                onClick={() => removeLearningObjective(index)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded mt-5"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Learning Content Section */}
        <div className="mb-8 p-4 border rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Learning Content</h3>
            <button
              type="button"
              onClick={addContentBlock}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
            >
              Add Content Block
            </button>
          </div>

          {formData.learningContent.map((block, index) => (
            <div key={index} className="mb-6 p-4 border rounded">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">Content Block {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeContentBlock(index)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Type
                  </label>
                  <select
                    value={block.type}
                    onChange={(e) =>
                      handleContentBlockChange(index, "type", e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="text">Text</option>
                    <option value="image">Image</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Order
                  </label>
                  <input
                    type="number"
                    value={block.order}
                    onChange={(e) =>
                      handleContentBlockChange(
                        index,
                        "order",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {block.type === "image" && (
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <img
                      src={block.image?.url || "/placeholder-image.jpg"}
                      alt="Content block"
                      className="w-24 h-24 object-cover border rounded mr-4"
                    />
                    <button
                      type="button"
                      onClick={() => handleImageUpload(index, "image")}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Change Image
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Alt Text
                      </label>
                      <input
                        type="text"
                        value={block.image?.alt || ""}
                        onChange={(e) =>
                          handleContentBlockChange(index, "image", {
                            ...block.image,
                            alt: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Caption
                      </label>
                      <input
                        type="text"
                        value={block.image?.caption || ""}
                        onChange={(e) =>
                          handleContentBlockChange(index, "image", {
                            ...block.image,
                            caption: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Content
                </label>
                {block.type === "text" || block.type === "image" ? (
                  <textarea
                    value={
                      typeof block.content === "string"
                        ? block.content
                        : block.content?.text || ""
                    }
                    onChange={(e) =>
                      handleContentBlockChange(index, "content", e.target.value)
                    }
                    rows="4"
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <input
                    type="text"
                    value={
                      typeof block.content === "string"
                        ? block.content
                        : block.content?.text || ""
                    }
                    onChange={(e) =>
                      handleContentBlockChange(index, "content", e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Tasks Section */}
        <div className="mb-8 p-4 border rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Interactive Tasks</h3>

          {formData.interactiveTasks.map((task, index) => (
            <div key={index} className="mb-6 p-4 border rounded">
              <h4 className="font-medium mb-3">
                Task {index + 1}: {task.title}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Type
                  </label>
                  <input
                    type="text"
                    value={task.type}
                    readOnly
                    className="w-full px-3 py-2 border rounded bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Points
                  </label>
                  <input
                    type="number"
                    value={task.points}
                    onChange={(e) =>
                      handleInteractiveTaskChange(
                        index,
                        "points",
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={task.title}
                  onChange={(e) =>
                    handleInteractiveTaskChange(index, "title", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <textarea
                  value={task.description}
                  onChange={(e) =>
                    handleInteractiveTaskChange(
                      index,
                      "description",
                      e.target.value
                    )
                  }
                  rows="2"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Instructions
                </label>
                <textarea
                  value={task.instructions}
                  onChange={(e) =>
                    handleInteractiveTaskChange(
                      index,
                      "instructions",
                      e.target.value
                    )
                  }
                  rows="2"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Drag-Drop Task Items */}
              {task.type === "drag-drop" && task.config && (
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h5 className="font-medium">Drag-Drop Items</h5>
                    <button
                      type="button"
                      onClick={() => addDragDropItem(index)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Add Item
                    </button>
                  </div>

                  {task.config.items?.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="mb-4 p-3 border rounded flex items-start"
                    >
                      <div className="flex-1 mr-2">
                        <label className="block text-gray-700 text-sm font-bold mb-1">
                          Item {itemIndex + 1} Text
                        </label>
                        <input
                          type="text"
                          value={item.text}
                          onChange={(e) =>
                            handleDragDropItemChange(
                              index,
                              itemIndex,
                              "text",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="mr-2">
                        <div className="flex items-center">
                          {item.image?.url && (
                            <img
                              src={item.image.url}
                              alt={`Item ${itemIndex + 1}`}
                              className="w-16 h-16 object-cover border rounded mr-2"
                            />
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              handleDragDropItemImageUpload(index, itemIndex)
                            }
                            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                          >
                            Change
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeDragDropItem(index, itemIndex)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded mt-5"
                      >
                        Remove
                      </button>
                    </div>
                  ))}

                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h5 className="font-medium">Categories</h5>
                      <button
                        type="button"
                        onClick={() => addDragDropCategory(index)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Add Category
                      </button>
                    </div>

                    {task.config.categories?.map((category, catIndex) => (
                      <div
                        key={catIndex}
                        className="mb-4 p-3 border rounded flex items-start"
                      >
                        <div className="flex-1 mr-2">
                          <label className="block text-gray-700 text-sm font-bold mb-1">
                            Category Name
                          </label>
                          <input
                            type="text"
                            value={category.name}
                            onChange={(e) =>
                              handleDragDropCategoryChange(
                                index,
                                catIndex,
                                "name",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="flex-1 mr-2">
                          <label className="block text-gray-700 text-sm font-bold mb-1">
                            Description
                          </label>
                          <input
                            type="text"
                            value={category.description}
                            onChange={(e) =>
                              handleDragDropCategoryChange(
                                index,
                                catIndex,
                                "description",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="mr-2">
                          <div className="flex items-center">
                            {category.image?.url && (
                              <img
                                src={category.image.url}
                                alt={`Category ${catIndex + 1}`}
                                className="w-16 h-16 object-cover border rounded mr-2"
                              />
                            )}
                            <button
                              type="button"
                              onClick={() => handleDragDropCategoryImageUpload(index, catIndex)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                            >
                              {category.image?.url ? 'Change' : 'Add'} Image
                            </button>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeDragDropCategory(index, catIndex)
                          }
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded mt-5"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quiz Section */}
        <div className="mb-8 p-4 border rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Quiz</h3>
            <button
              type="button"
              onClick={addQuizQuestion}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
            >
              Add Question
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Quiz Title
              </label>
              <input
                type="text"
                value={formData.quiz.title}
                onChange={(e) =>
                  handleNestedChange("quiz", "title", e.target.value)
                }
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Passing Score (%)
              </label>
              <input
                type="number"
                value={formData.quiz.passingScore}
                onChange={(e) =>
                  handleNestedChange(
                    "quiz",
                    "passingScore",
                    parseInt(e.target.value)
                  )
                }
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Quiz Description
            </label>
            <textarea
              value={formData.quiz.description}
              onChange={(e) =>
                handleNestedChange("quiz", "description", e.target.value)
              }
              rows="2"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={formData.quiz.allowRetake}
              onChange={(e) =>
                handleNestedChange("quiz", "allowRetake", e.target.checked)
              }
              className="mr-2"
            />
            <label className="text-gray-700 text-sm">Allow Retake</label>
          </div>

          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              checked={formData.quiz.showCorrectAnswers}
              onChange={(e) =>
                handleNestedChange(
                  "quiz",
                  "showCorrectAnswers",
                  e.target.checked
                )
              }
              className="mr-2"
            />
            <label className="text-gray-700 text-sm">
              Show Correct Answers
            </label>
          </div>

          {formData.quiz.questions.map((question, index) => (
            <div key={index} className="mb-6 p-4 border rounded">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">
                  Question {question.questionNumber}
                </h4>
                <button
                  type="button"
                  onClick={() => removeQuizQuestion(index)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Question Type
                  </label>
                  <select
                    value={question.type}
                    onChange={(e) =>
                      handleQuizQuestionChange(index, "type", e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="true-false">True/False</option>
                    <option value="multi-select">Multi-Select</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Points
                  </label>
                  <input
                    type="number"
                    value={question.points}
                    onChange={(e) =>
                      handleQuizQuestionChange(
                        index,
                        "points",
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Question Text
                </label>
                <textarea
                  value={question.question}
                  onChange={(e) =>
                    handleQuizQuestionChange(index, "question", e.target.value)
                  }
                  rows="2"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Explanation
                </label>
                <textarea
                  value={question.explanation}
                  onChange={(e) =>
                    handleQuizQuestionChange(
                      index,
                      "explanation",
                      e.target.value
                    )
                  }
                  rows="2"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-gray-700 text-sm font-bold">
                    Options
                  </label>
                  <button
                    type="button"
                    onClick={() => addQuizOption(index)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Add Option
                  </button>
                </div>

                {question.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className="mb-3 p-3 border rounded flex items-start"
                  >
                    <div className="flex-1 mr-2">
                      <label className="block text-gray-700 text-sm font-bold mb-1">
                        Option {option.id}
                      </label>
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) =>
                          handleQuizOptionChange(
                            index,
                            optionIndex,
                            "text",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center mr-2">
                      <input
                        type="radio"
                        name={`correct-answer-${index}`}
                        checked={option.isCorrect}
                        onChange={(e) => {
                          if (e.target.checked) {
                            // Uncheck all other options
                            const updatedQuestions = [
                              ...formData.quiz.questions,
                            ];
                            updatedQuestions[index].options.forEach((opt) => {
                              opt.isCorrect = false;
                            });
                            // Check the selected option
                            updatedQuestions[index].options[
                              optionIndex
                            ].isCorrect = true;
                            // Update correctAnswer field
                            updatedQuestions[index].correctAnswer = option.id;

                            setFormData((prev) => ({
                              ...prev,
                              quiz: {
                                ...prev.quiz,
                                questions: updatedQuestions,
                              },
                            }));
                          }
                        }}
                        className="mr-1"
                      />
                      <span className="text-sm">Correct</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeQuizOption(index, optionIndex)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Parent Tip Section */}
        <div className="mb-8 p-4 border rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Parent Tip</h3>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.parentTip.title}
              onChange={(e) =>
                handleNestedChange("parentTip", "title", e.target.value)
              }
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Content
            </label>
            <textarea
              value={formData.parentTip.content}
              onChange={(e) =>
                handleNestedChange("parentTip", "content", e.target.value)
              }
              rows="4"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Updating..." : "Update Module"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Onemodules;
