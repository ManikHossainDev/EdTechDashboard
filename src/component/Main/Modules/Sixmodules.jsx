import { useState, useEffect } from "react";
import {
  useGetModulesByIdQuery,
  useUpdateModulesOneMutation,
} from "../../../redux/features/modules/modulesGet";
import MediaUploadModal from "./MediaUploadModal";

const Sixmodules = () => {
  const id = "69366f0df4d0d2d1e21e1d67";
  const { data, isLoading, isError, error } = useGetModulesByIdQuery(id);
  // Handle form submission - moved to top to maintain consistent hook order
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateModuleTwo] = useUpdateModulesOneMutation();

  // Media upload modal state
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [currentMediaField, setCurrentMediaField] = useState(null);
  const [currentMediaType, setCurrentMediaType] = useState("image");

  // Optimized data transformation function
  const transformApiData = (apiData) => {
    if (!apiData?.data) return null;

    const moduleData = apiData.data;

    // Format learning objectives
    const formattedLearningObjectives =
      moduleData.learningObjectives?.map((obj) => obj.text) || [];

    // Format learning content as content blocks
    const formattedContentBlocks =
      moduleData.learningContent?.map((content, index) => {
        if (content.type === "image") {
          return {
            type: content.type,
            order: content.order || index + 1,
            content: content.content?.text || "",
            image: content.content?.image || null,
            alt: content.content?.image?.alt || "",
            caption: content.content?.image?.caption || "",
          };
        } else {
          return {
            type: content.type || "text",
            order: content.order || index + 1,
            content: content.content?.text || "",
            listItems: content.content?.listItems || [],
          };
        }
      }) || [];

    // Format interactive tasks
    const formattedInteractiveTasks =
      moduleData.interactiveTasks?.map((task) => ({
        type: task.type || "sort-categories",
        title: task.title || "",
        description: task.description || "",
        instructions: task.instructions || "",
        points: task.points || 20,
        config: task.config || {},
      })) || [];

    // Format quiz
    const formattedQuiz = {
      title: moduleData.quiz?.title || "",
      description: moduleData.quiz?.description || "",
      passingScore: moduleData.quiz?.passingScore || 75,
      totalPoints: moduleData.quiz?.totalPoints || 100,
      allowRetake: moduleData.quiz?.allowRetake || true,
      showCorrectAnswers: moduleData.quiz?.showCorrectAnswers || true,
      questions:
        moduleData.quiz?.questions?.map((question, index) => {
          // Handle the case where options might be incomplete
          const options = Array.isArray(question.options)
            ? question.options.map((option) => ({
                id: option.id,
                text: option.text,
                isCorrect: option.isCorrect,
              }))
            : [];

          return {
            questionNumber: question.questionNumber || index + 1,
            type: question.type || "multiple-choice",
            question: question.question || "",
            points: question.points || 10,
            explanation: question.explanation || "",
            options: options,
          };
        }) || [],
    };

    // Format parent tip
    const formattedParentTip = {
      title: moduleData.parentTip?.title || "For Parents",
      content: moduleData.parentTip?.content || "",
      additionalResources: moduleData.parentTip?.additionalResources || [],
    };

    // Return the formatted data
    return {
      moduleNumber: moduleData.moduleNumber || 1,
      title: moduleData.title || "",
      theme: moduleData.theme || "",
      description: moduleData.description || "",
      slug: moduleData.slug || "",
      status: moduleData.status || "draft",
      order: moduleData.order || 1,
      introVideo: moduleData.introVideo || null,
      unlockConditions: moduleData.unlockConditions || {
        requiresPreviousModule: false,
      },
      learningObjectives: formattedLearningObjectives,
      contentBlocks: formattedContentBlocks,
      interactiveTasks: formattedInteractiveTasks,
      quiz: formattedQuiz,
      parentTip: formattedParentTip,
      prerequisites: moduleData.prerequisites || [],
      createdAt: moduleData.createdAt,
      updatedAt: moduleData.updatedAt,
      publishedAt: moduleData.publishedAt,
      id: moduleData.id,
    };
  };

  // Initialize formData state first, before any conditional returns
  // We use the transformed data if available, otherwise default values
  const [formData, setFormData] = useState(() => {
    if (data && !isLoading && !isError) {
      const transformedData = transformApiData(data);
      if (transformedData) {
        return transformedData;
      }
    }

    // Default values if no data is available
    return {
      moduleNumber: 1,
      title: "",
      theme: "",
      description: "",
      slug: "",
      status: "draft",
      order: 1,
      introVideo: null,
      unlockConditions: { requiresPreviousModule: false },
      learningObjectives: [""],
      contentBlocks: [{ type: "text", order: 1, content: "", listItems: [] }],
      interactiveTasks: [
        {
          type: "sort-categories",
          title: "",
          description: "",
          instructions: "",
          points: 20,
          config: {},
        },
      ],
      quiz: {
        title: "",
        description: "",
        passingScore: 75,
        totalPoints: 20,
        allowRetake: true,
        showCorrectAnswers: true,
        questions: [
          {
            questionNumber: 1,
            type: "multiple-choice",
            question: "",
            points: 10,
            explanation: "",
            options: [{ id: "A", text: "", isCorrect: false }],
          },
        ],
      },
      parentTip: {
        title: "For Parents",
        content: "",
        additionalResources: [],
      },
      prerequisites: [],
      createdAt: null,
      updatedAt: null,
      publishedAt: null,
      id: null,
    };
  });

  // Update form data when API data becomes available
  useEffect(() => {
    if (data && !isLoading && !isError) {
      const transformedData = transformApiData(data);
      if (transformedData) {
        setFormData(transformedData);
      }
    }
  }, [data, isLoading, isError]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Loading Module...</h2>
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4">Loading module data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Error Loading Module</h2>
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">
            {error?.data?.message ||
              error?.error ||
              "Failed to load module data"}
          </span>
        </div>
      </div>
    );
  }

  // Console log the original data
  console.log("Original API Data:", data);

  // Transform the data
  const formattedData = transformApiData(data);

  // Console log the transformed data
  console.log("Formatted Data:", formattedData);

  // Log the updated values after transformation
  console.log("Updated values after transformation:", {
    title: formattedData?.title,
    description: formattedData?.description,
    learningObjectives: formattedData?.learningObjectives,
    contentBlocks: formattedData?.contentBlocks,
    interactiveTasks: formattedData?.interactiveTasks,
    quiz: formattedData?.quiz,
    parentTip: formattedData?.parentTip,
  });

  // Handle main form changes
  const handleMainChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedData = {
        ...prev,
        [name]: value,
      };
      // Console log the updated values when form fields change
      console.log("Updated main form field:", name, "to:", value);
      console.log("Current form data:", updatedData);
      return updatedData;
    });
  };

  // Handle learning objectives changes
  const handleLearningObjectiveChange = (index, value) => {
    const newObjectives = [...formData.learningObjectives];
    newObjectives[index] = value;
    setFormData((prev) => {
      const updatedData = {
        ...prev,
        learningObjectives: newObjectives,
      };
      // Console log the updated values when learning objectives change
      console.log("Updated learning objective at index:", index, "to:", value);
      console.log("Current learning objectives:", newObjectives);
      return updatedData;
    });
  };

  const addLearningObjective = () => {
    setFormData((prev) => ({
      ...prev,
      learningObjectives: [...prev.learningObjectives, ""],
    }));
  };

  const removeLearningObjective = (index) => {
    const newObjectives = formData.learningObjectives.filter(
      (_, i) => i !== index
    );
    setFormData((prev) => ({
      ...prev,
      learningObjectives: newObjectives,
    }));
  };

  // Handle content blocks changes
  const handleContentBlockChange = (index, field, value) => {
    const newBlocks = [...formData.contentBlocks];
    newBlocks[index][field] = value;
    setFormData((prev) => {
      const updatedData = {
        ...prev,
        contentBlocks: newBlocks,
      };
      // Console log the updated values when content blocks change
      console.log(
        "Updated content block at index:",
        index,
        "field:",
        field,
        "to:",
        value
      );
      console.log("Current content blocks:", newBlocks);
      return updatedData;
    });
  };

  const addContentBlock = () => {
    const newOrder = formData.contentBlocks.length + 1;
    setFormData((prev) => ({
      ...prev,
      contentBlocks: [
        ...prev.contentBlocks,
        { type: "text", order: newOrder, content: "", listItems: [] },
      ],
    }));
  };

  const removeContentBlock = (index) => {
    const newBlocks = formData.contentBlocks.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      contentBlocks: newBlocks.map((block, i) => ({ ...block, order: i + 1 })),
    }));
  };

  // Handle interactive tasks changes
  const handleInteractiveTaskChange = (taskIndex, field, value) => {
    const newTasks = [...formData.interactiveTasks];
    newTasks[taskIndex][field] = value;
    setFormData((prev) => {
      const updatedData = {
        ...prev,
        interactiveTasks: newTasks,
      };
      // Console log the updated values when interactive task changes
      console.log("Updated interactive task field:", field, "to:", value);
      console.log("Current interactive tasks:", updatedData.interactiveTasks);
      return updatedData;
    });
  };

  const addInteractiveTask = () => {
    setFormData((prev) => ({
      ...prev,
      interactiveTasks: [
        ...prev.interactiveTasks,
        {
          type: "sort-categories",
          title: "",
          description: "",
          instructions: "",
          points: 20,
          config: {},
        },
      ],
    }));
  };

  const removeInteractiveTask = (index) => {
    const newTasks = formData.interactiveTasks.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      interactiveTasks: newTasks,
    }));
  };

  // Handle quiz changes
  const handleQuizChange = (field, value) => {
    setFormData((prev) => {
      const updatedData = {
        ...prev,
        quiz: {
          ...prev.quiz,
          [field]: value,
        },
      };
      // Console log the updated values when quiz changes
      console.log("Updated quiz field:", field, "to:", value);
      console.log("Current quiz:", updatedData.quiz);
      return updatedData;
    });
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...formData.quiz.questions];
    newQuestions[index][field] = value;
    setFormData((prev) => {
      const updatedData = {
        ...prev,
        quiz: {
          ...prev.quiz,
          questions: newQuestions,
        },
      };
      // Console log the updated values when question changes
      console.log(
        "Updated question at index:",
        index,
        "field:",
        field,
        "to:",
        value
      );
      console.log("Current questions:", newQuestions);
      return updatedData;
    });
  };

  const handleOptionChange = (questionIndex, optionIndex, field, value) => {
    const newQuestions = [...formData.quiz.questions];
    newQuestions[questionIndex].options[optionIndex][field] = value;
    setFormData((prev) => {
      const updatedData = {
        ...prev,
        quiz: {
          ...prev.quiz,
          questions: newQuestions,
        },
      };
      // Console log the updated values when option changes
      console.log(
        "Updated option at question:",
        questionIndex,
        "option:",
        optionIndex,
        "field:",
        field,
        "to:",
        value
      );
      console.log("Current questions:", newQuestions);
      return updatedData;
    });
  };

  const addQuestion = () => {
    const newNumber = formData.quiz.questions.length + 1;
    setFormData((prev) => ({
      ...prev,
      quiz: {
        ...prev.quiz,
        questions: [
          ...prev.quiz.questions,
          {
            questionNumber: newNumber,
            type: "multiple-choice",
            question: "",
            points: 10,
            explanation: "",
            options: [{ id: "A", text: "", isCorrect: false }],
          },
        ],
      },
    }));
  };

  const removeQuestion = (index) => {
    const newQuestions = formData.quiz.questions.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      quiz: {
        ...prev.quiz,
        questions: newQuestions.map((q, i) => ({
          ...q,
          questionNumber: i + 1,
        })),
      },
    }));
  };

  const addOption = (questionIndex) => {
    const newOptions = [...formData.quiz.questions[questionIndex].options];
    const nextLetter = String.fromCharCode(65 + newOptions.length); // A, B, C, etc.
    newOptions.push({ id: nextLetter, text: "", isCorrect: false });
    const newQuestions = [...formData.quiz.questions];
    newQuestions[questionIndex].options = newOptions;
    setFormData((prev) => ({
      ...prev,
      quiz: {
        ...prev.quiz,
        questions: newQuestions,
      },
    }));
  };

  const removeOption = (questionIndex, optionIndex) => {
    const newQuestions = [...formData.quiz.questions];
    newQuestions[questionIndex].options = newQuestions[
      questionIndex
    ].options.filter((_, i) => i !== optionIndex);
    setFormData((prev) => ({
      ...prev,
      quiz: {
        ...prev.quiz,
        questions: newQuestions,
      },
    }));
  };

  // Handle parent tip changes
  const handleParentTipChange = (field, value) => {
    setFormData((prev) => {
      const updatedData = {
        ...prev,
        parentTip: {
          ...prev.parentTip,
          [field]: value,
        },
      };
      // Console log the updated values when parent tip changes
      console.log("Updated parent tip field:", field, "to:", value);
      console.log("Current parent tip:", updatedData.parentTip);
      return updatedData;
    });
  };

  // Handle media upload
  const openMediaUploadModal = (field, mediaType) => {
    setCurrentMediaField(field);
    setCurrentMediaType(mediaType);
    setIsMediaModalOpen(true);
  };

  const handleMediaUpload = (mediaData) => {
    if (currentMediaField.startsWith("introVideo")) {
      setFormData((prev) => ({
        ...prev,
        introVideo: mediaData,
      }));
    } else if (currentMediaField.startsWith("contentBlockImage")) {
      const [, index] = currentMediaField.split("-");
      const newBlocks = [...formData.contentBlocks];
      newBlocks[index] = {
        ...newBlocks[index],
        image: mediaData,
        type: "image",
      };
      setFormData((prev) => ({
        ...prev,
        contentBlocks: newBlocks,
      }));
    } else if (currentMediaField.startsWith("interactiveTaskItem")) {
      const [, taskIndex, itemIndex] = currentMediaField.split("-");
      const newTasks = [...formData.interactiveTasks];
      const newItems = [...newTasks[taskIndex].config.items];
      newItems[itemIndex] = {
        ...newItems[itemIndex],
        image: mediaData,
      };
      newTasks[taskIndex].config.items = newItems;
      setFormData((prev) => ({
        ...prev,
        interactiveTasks: newTasks,
      }));
    } else if (currentMediaField.startsWith("interactiveTaskCategory")) {
      const [, taskIndex, categoryIndex] = currentMediaField.split("-");
      const newTasks = [...formData.interactiveTasks];
      const newCategories = [...newTasks[taskIndex].config.categories];
      newCategories[categoryIndex] = {
        ...newCategories[categoryIndex],
        image: mediaData,
      };
      newTasks[taskIndex].config.categories = newCategories;
      setFormData((prev) => ({
        ...prev,
        interactiveTasks: newTasks,
      }));
    }
    setIsMediaModalOpen(false);
  };

  // Format data for saving according to the exact required format
  const formatForSave = () => {
    // Extract the learning objectives from the text
    const learningObjectives = formData.learningObjectives.filter(
      (obj) => obj.trim() !== ""
    );

    // Format content blocks
    const contentBlocks = formData.contentBlocks
      .filter((block) => block.content.trim() !== "")
      .map((block, index) => ({
        type: block.type,
        order: block.order || index + 1,
        content: block.content,
      }));

    // Format interactive tasks
    const interactiveTasks = formData.interactiveTasks
      .map((task) => {
        if (task.type === "sort-categories") {
          return {
            type: task.type,
            title: task.title,
            description: task.description,
            instructions: task.instructions,
            points: 800, // Fixed value as per requirements
            items:
              task.config.items
                ?.filter((item) => item.text.trim() !== "")
                .map((item) => ({
                  id: item.id,
                  text: item.text,
                })) || [],
            categories:
              task.config.categories
                ?.filter((cat) => cat.name.trim() !== "")
                .map((category) => ({
                  id: category.id,
                  name: category.name,
                  description: category.description,
                })) || [],
            correctMapping: task.config.correctMapping || {},
          };
        } else if (
          task.type === "scenario-choice" ||
          task.type === "chat-simulator"
        ) {
          // Handle chat simulator type specifically
          return {
            type: task.type,
            title: task.title,
            description: task.description,
            instructions: task.instructions,
            points: task.points || 42.6, // Default to 42.6 as per example data
            config: {
              scenarios:
                task.config.scenarios?.map((scenario) => ({
                  id: scenario.id,
                  text: scenario.text, // situation in the original data
                  situation: scenario.situation || scenario.text,
                  hint: scenario.hint || "",
                  responses:
                    scenario.responses?.map((response) => ({
                      id: response.id,
                      text: response.text,
                      feedback: response.feedback,
                      isCorrect: response.isCorrect,
                    })) || [],
                })) || [],
            },
          };
        }
        return task;
      })
      .filter((task) => task.title && task.title.trim() !== "");

    // Format quiz questions
    const quizQuestions = formData.quiz.questions
      .filter((q) => q.question.trim() !== "")
      .map((q, idx) => ({
        questionNumber: idx + 1,
        type: q.type,
        question: q.question,
        explanation: q.explanation,
        options: q.options
          .filter((opt) => opt.text.trim() !== "")
          .map((option) => ({
            id: option.id,
            text: option.text,
            isCorrect: option.isCorrect,
          })),
      }));

    // Return the exact format required
    return {
      moduleNumber: formData.moduleNumber,
      title: formData.title,
      theme: formData.theme,
      description: formData.description,
      slug: formData.slug,
      status: "draft", // Always set to draft as per requirements
      order: formData.order,
      learningObjectives: learningObjectives,
      contentBlocks: contentBlocks,
      interactiveTasks: interactiveTasks,
      quiz: {
        title: formData.quiz.title,
        description: formData.quiz.description,
        passingScore: formData.quiz.passingScore,
        allowRetake: formData.quiz.allowRetake,
        showCorrectAnswers: formData.quiz.showCorrectAnswers,
        questions: quizQuestions,
      },
      parentTip: {
        title: formData.parentTip.title,
        content: formData.parentTip.content,
      },
    };
  };

  // Helper function to add interactive items
  const addInteractiveItem = (taskIndex) => {
    const newTasks = [...formData.interactiveTasks];
    const newId = `i${newTasks[taskIndex].config.items?.length + 1 || 1}`;
    newTasks[taskIndex].config.items = [
      ...(newTasks[taskIndex].config.items || []),
      { id: newId, text: "", image: null },
    ];
    setFormData((prev) => ({
      ...prev,
      interactiveTasks: newTasks,
    }));
  };

  // Helper function to remove interactive items
  const removeInteractiveItem = (taskIndex, itemIndex) => {
    const newTasks = [...formData.interactiveTasks];
    newTasks[taskIndex].config.items = newTasks[taskIndex].config.items.filter(
      (_, i) => i !== itemIndex
    );
    setFormData((prev) => ({
      ...prev,
      interactiveTasks: newTasks,
    }));
  };

  // Helper function to update interactive item
  const handleInteractiveItemChange = (taskIndex, itemIndex, field, value) => {
    const newTasks = [...formData.interactiveTasks];
    newTasks[taskIndex].config.items[itemIndex][field] = value;
    setFormData((prev) => ({
      ...prev,
      interactiveTasks: newTasks,
    }));
  };

  // Helper function to add categories
  const addCategory = (taskIndex) => {
    const newTasks = [...formData.interactiveTasks];
    const newId = `cat${
      newTasks[taskIndex].config.categories?.length + 1 || 1
    }`;
    newTasks[taskIndex].config.categories = [
      ...(newTasks[taskIndex].config.categories || []),
      { id: newId, name: "", description: "", image: null },
    ];
    setFormData((prev) => ({
      ...prev,
      interactiveTasks: newTasks,
    }));
  };

  // Helper function to update category
  const handleCategoryChange = (taskIndex, categoryIndex, field, value) => {
    const newTasks = [...formData.interactiveTasks];
    newTasks[taskIndex].config.categories[categoryIndex][field] = value;
    setFormData((prev) => ({
      ...prev,
      interactiveTasks: newTasks,
    }));
  };

  // Helper function to handle correct mapping changes
  const handleCorrectMappingChange = (taskIndex, itemId, categoryId) => {
    const newTasks = [...formData.interactiveTasks];
    newTasks[taskIndex].config.correctMapping = {
      ...newTasks[taskIndex].config.correctMapping,
      [itemId]: categoryId,
    };
    setFormData((prev) => ({
      ...prev,
      interactiveTasks: newTasks,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Format the data as required
    const saveData = formatForSave();
    console.log(saveData);

    // Log the data in the exact required format
    const requiredFormat = {
      moduleNumber: saveData.moduleNumber,
      title: saveData.title,
      theme: saveData.theme,
      description: saveData.description,
      slug: saveData.slug,
      status: "draft", // Always draft as per requirements
      order: saveData.order,
      learningObjectives: saveData.learningObjectives,
      contentBlocks: saveData.contentBlocks.map((block) => ({
        type: block.type,
        order: block.order,
        content: block.content,
      })),
      interactiveTasks: saveData.interactiveTasks.map((task) => {
        if (task.type === "chat-simulator") {
          // Format chat simulator task to match required format
          return {
            type: task.type,
            title: task.title,
            description: task.description,
            instructions: task.instructions,
            points: task.points,
            config: {
              scenarios: task.config.scenarios.map((scenario) => ({
                id: scenario.id,
                text: scenario.text,
                situation: scenario.situation,
                hint: scenario.hint,
                responses: scenario.responses.map((response) => ({
                  id: response.id,
                  text: response.text,
                  feedback: response.feedback,
                  isCorrect: response.isCorrect,
                })),
              })),
            },
          };
        }
        // For other task types, return them as they are
        return {
          type: task.type,
          title: task.title,
          description: task.description,
          instructions: task.instructions,
          points: task.points,
          ...(task.config ? { config: task.config } : {}),
        };
      }),
      quiz: {
        title: saveData.quiz.title,
        description: saveData.quiz.description,
        passingScore: saveData.quiz.passingScore,
        allowRetake: saveData.quiz.allowRetake,
        showCorrectAnswers: saveData.quiz.showCorrectAnswers,
        questions: saveData.quiz.questions.map((q) => ({
          questionNumber: q.questionNumber,
          type: q.type,
          question: q.question,
          explanation: q.explanation,
          options: q.options.map((opt) => ({
            id: opt.id,
            text: opt.text,
            isCorrect: opt.isCorrect,
          })),
        })),
      },
      parentTip: {
        title: saveData.parentTip.title,
        content: saveData.parentTip.content,
      },
    };

    console.log(requiredFormat);

    try {
      const res = await updateModuleTwo({ id, updatedData: saveData });
      console.log(res, "im the api response");
    } catch (error) {
      alert("Error to Update");
    }
    alert("Data logged to console!");
    setIsSubmitting(false);
  };

  // Render the form
  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Module Editor</h2>

      {/* Display intro video if available */}
      {formData.introVideo && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Intro Video</h3>
          <video
            src={formData.introVideo.url}
            controls
            className="w-full max-w-lg rounded"
          />
          <div className="mt-2 text-sm text-gray-600">
            Duration:{" "}
            {formData.introVideo.duration
              ? `${formData.introVideo.duration}s`
              : "Unknown"}
          </div>
          <button
            type="button"
            onClick={() => openMediaUploadModal("introVideo", "video")}
            className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
          >
            Replace Video
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Module Info */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-4">Module Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="moduleNumber"
                className="block text-sm font-medium mb-1"
              >
                Module Number
              </label>
              <input
                id="moduleNumber"
                type="number"
                name="moduleNumber"
                value={formData.moduleNumber}
                onChange={handleMainChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                required
                aria-describedby="moduleNumberHelp"
              />
              <p id="moduleNumberHelp" className="mt-1 text-xs text-gray-500">
                Enter the module number (e.g., 1, 2, 3)
              </p>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Title
              </label>
              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleMainChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                required
                aria-describedby="titleHelp"
              />
              <p id="titleHelp" className="mt-1 text-xs text-gray-500">
                Enter the module title
              </p>
            </div>

            <div>
              <label htmlFor="theme" className="block text-sm font-medium mb-1">
                Theme
              </label>
              <input
                id="theme"
                type="text"
                name="theme"
                value={formData.theme}
                onChange={handleMainChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                required
                aria-describedby="themeHelp"
              />
              <p id="themeHelp" className="mt-1 text-xs text-gray-500">
                Enter the module theme
              </p>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleMainChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                required
                aria-describedby="descriptionHelp"
              ></textarea>
              <p id="descriptionHelp" className="mt-1 text-xs text-gray-500">
                Enter the module description
              </p>
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium mb-1">
                Slug
              </label>
              <input
                id="slug"
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleMainChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                required
                aria-describedby="slugHelp"
              />
              <p id="slugHelp" className="mt-1 text-xs text-gray-500">
                URL-friendly identifier (e.g., respectful-communication)
              </p>
            </div>

            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium mb-1"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleMainChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                aria-describedby="statusHelp"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
              <p id="statusHelp" className="mt-1 text-xs text-gray-500">
                Set the module status
              </p>
            </div>

            <div>
              <label htmlFor="order" className="block text-sm font-medium mb-1">
                Order
              </label>
              <input
                id="order"
                type="number"
                name="order"
                value={formData.order}
                onChange={handleMainChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                required
                aria-describedby="orderHelp"
              />
              <p id="orderHelp" className="mt-1 text-xs text-gray-500">
                Enter the order number for this module
              </p>
            </div>
          </div>
        </div>

        {/* Learning Objectives */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Learning Objectives</h3>
            <button
              type="button"
              onClick={addLearningObjective}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Add learning objective"
            >
              Add Objective
            </button>
          </div>

          {formData.learningObjectives.map((objective, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <div className="flex-1">
                <label htmlFor={`objective-${index}`} className="sr-only">
                  Learning Objective {index + 1}
                </label>
                <input
                  id={`objective-${index}`}
                  type="text"
                  value={objective}
                  onChange={(e) =>
                    handleLearningObjectiveChange(index, e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  placeholder={`Objective ${index + 1}`}
                  aria-describedby={`objective-${index}-help`}
                />
                <p id={`objective-${index}-help`} className="sr-only">
                  Enter learning objective {index + 1}
                </p>
              </div>
              {formData.learningObjectives.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLearningObjective(index)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  aria-label={`Remove objective ${index + 1}`}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Content Blocks */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Content Blocks</h3>
            <button
              type="button"
              onClick={addContentBlock}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Add content block"
            >
              Add Block
            </button>
          </div>

          {formData.contentBlocks.map((block, index) => (
            <div
              key={index}
              className="mb-4 p-4 border border-gray-200 rounded"
              role="region"
              aria-labelledby={`content-block-${index}-label`}
            >
              <div className="flex justify-between items-center mb-2">
                <h4 id={`content-block-${index}-label`} className="font-medium">
                  Block {index + 1}
                </h4>
                {formData.contentBlocks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeContentBlock(index)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    aria-label={`Remove content block ${index + 1}`}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor={`content-block-type-${index}`}
                    className="block text-sm font-medium mb-1"
                  >
                    Type
                  </label>
                  <select
                    id={`content-block-type-${index}`}
                    value={block.type}
                    onChange={(e) =>
                      handleContentBlockChange(index, "type", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    aria-describedby={`content-block-type-${index}-help`}
                  >
                    <option value="text">Text</option>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="audio">Audio</option>
                  </select>
                  <p
                    id={`content-block-type-${index}-help`}
                    className="sr-only"
                  >
                    Select the type of content block
                  </p>
                </div>

                <div>
                  <label
                    htmlFor={`content-block-order-${index}`}
                    className="block text-sm font-medium mb-1"
                  >
                    Order
                  </label>
                  <input
                    id={`content-block-order-${index}`}
                    type="number"
                    value={block.order}
                    onChange={(e) =>
                      handleContentBlockChange(index, "order", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    aria-describedby={`content-block-order-${index}-help`}
                  />
                  <p
                    id={`content-block-order-${index}-help`}
                    className="sr-only"
                  >
                    Set the order of this content block
                  </p>
                </div>
              </div>

              {block.type === "image" && (
                <div className="mt-2">
                  {block.image && (
                    <div className="mb-2">
                      <img
                        src={block.image.url}
                        alt={block.alt || "Content block image"}
                        className="max-w-xs rounded"
                      />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      openMediaUploadModal(
                        `contentBlockImage-${index}`,
                        "image"
                      )
                    }
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label={block.image ? "Replace image" : "Add image"}
                  >
                    {block.image ? "Replace Image" : "Add Image"}
                  </button>
                </div>
              )}

              <div className="mt-2">
                <label
                  htmlFor={`content-block-content-${index}`}
                  className="block text-sm font-medium mb-1"
                >
                  Content
                </label>
                <textarea
                  id={`content-block-content-${index}`}
                  value={block.content}
                  onChange={(e) =>
                    handleContentBlockChange(index, "content", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  aria-describedby={`content-block-content-${index}-help`}
                ></textarea>
                <p
                  id={`content-block-content-${index}-help`}
                  className="sr-only"
                >
                  Enter the content for this block
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Tasks */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Interactive Tasks</h3>
            <button
              type="button"
              onClick={addInteractiveTask}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Add interactive task"
            >
              Add Task
            </button>
          </div>

          {formData.interactiveTasks.map((task, taskIndex) => (
            <div
              key={taskIndex}
              className="mb-6 p-4 border border-gray-300 rounded"
              role="region"
              aria-labelledby={`interactive-task-${taskIndex}-label`}
            >
              <div className="flex justify-between items-center mb-4">
                <h4
                  id={`interactive-task-${taskIndex}-label`}
                  className="font-medium"
                >
                  Task {taskIndex + 1}
                </h4>
                {formData.interactiveTasks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeInteractiveTask(taskIndex)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    aria-label={`Remove interactive task ${taskIndex + 1}`}
                  >
                    Remove Task
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor={`interactive-task-type-${taskIndex}`}
                    className="block text-sm font-medium mb-1"
                  >
                    Type
                  </label>
                  <select
                    id={`interactive-task-type-${taskIndex}`}
                    value={task.type}
                    onChange={(e) =>
                      handleInteractiveTaskChange(
                        taskIndex,
                        "type",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    aria-describedby={`interactive-task-type-${taskIndex}-help`}
                  >
                    <option value="sort-categories">Sort Categories</option>
                    <option value="scenario-choice">Scenario Choice</option>
                    <option value="chat-simulator">Chat Simulator</option>
                  </select>
                  <p
                    id={`interactive-task-type-${taskIndex}-help`}
                    className="sr-only"
                  >
                    Select the type of interactive task
                  </p>
                </div>

                <div>
                  <label
                    htmlFor={`interactive-task-title-${taskIndex}`}
                    className="block text-sm font-medium mb-1"
                  >
                    Title
                  </label>
                  <input
                    id={`interactive-task-title-${taskIndex}`}
                    type="text"
                    value={task.title}
                    onChange={(e) =>
                      handleInteractiveTaskChange(
                        taskIndex,
                        "title",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    aria-describedby={`interactive-task-title-${taskIndex}-help`}
                  />
                  <p
                    id={`interactive-task-title-${taskIndex}-help`}
                    className="sr-only"
                  >
                    Enter the title for this interactive task
                  </p>
                </div>

                <div>
                  <label
                    htmlFor={`interactive-task-description-${taskIndex}`}
                    className="block text-sm font-medium mb-1"
                  >
                    Description
                  </label>
                  <input
                    id={`interactive-task-description-${taskIndex}`}
                    type="text"
                    value={task.description}
                    onChange={(e) =>
                      handleInteractiveTaskChange(
                        taskIndex,
                        "description",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    aria-describedby={`interactive-task-description-${taskIndex}-help`}
                  />
                  <p
                    id={`interactive-task-description-${taskIndex}-help`}
                    className="sr-only"
                  >
                    Enter the description for this interactive task
                  </p>
                </div>

                <div>
                  <label
                    htmlFor={`interactive-task-instructions-${taskIndex}`}
                    className="block text-sm font-medium mb-1"
                  >
                    Instructions
                  </label>
                  <input
                    id={`interactive-task-instructions-${taskIndex}`}
                    type="text"
                    value={task.instructions}
                    onChange={(e) =>
                      handleInteractiveTaskChange(
                        taskIndex,
                        "instructions",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    aria-describedby={`interactive-task-instructions-${taskIndex}-help`}
                  />
                  <p
                    id={`interactive-task-instructions-${taskIndex}-help`}
                    className="sr-only"
                  >
                    Enter the instructions for this interactive task
                  </p>
                </div>

                <div>
                  <label
                    htmlFor={`interactive-task-points-${taskIndex}`}
                    className="block text-sm font-medium mb-1"
                  >
                    Points
                  </label>
                  <input
                    id={`interactive-task-points-${taskIndex}`}
                    type="number"
                    value={task.points}
                    onChange={(e) =>
                      handleInteractiveTaskChange(
                        taskIndex,
                        "points",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    aria-describedby={`interactive-task-points-${taskIndex}-help`}
                  />
                  <p
                    id={`interactive-task-points-${taskIndex}-help`}
                    className="sr-only"
                  >
                    Enter the points for this interactive task
                  </p>
                </div>
              </div>

              {task.type === "sort-categories" && (
                <>
                  {/* Items for sort-categories */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Items</h4>
                      <button
                        type="button"
                        onClick={() => addInteractiveItem(taskIndex)}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
                      >
                        Add Item
                      </button>
                    </div>

                    {task.config.items?.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={item.text}
                          onChange={(e) =>
                            handleInteractiveItemChange(
                              taskIndex,
                              itemIndex,
                              "text",
                              e.target.value
                            )
                          }
                          className="flex-1 p-2 border border-gray-300 rounded"
                          placeholder={`Item ${itemIndex + 1}`}
                        />
                        <select
                          value={task.config.correctMapping?.[item.id] || ""}
                          onChange={(e) =>
                            handleCorrectMappingChange(
                              taskIndex,
                              item.id,
                              e.target.value
                            )
                          }
                          className="p-2 border border-gray-300 rounded"
                        >
                          <option value="">Select Category</option>
                          {task.config.categories?.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() =>
                            openMediaUploadModal(
                              `interactiveTaskItem-${taskIndex}-${itemIndex}`,
                              "image"
                            )
                          }
                          className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
                        >
                          {item.image ? "Replace Image" : "Add Image"}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            removeInteractiveItem(taskIndex, itemIndex)
                          }
                          className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Categories for sort-categories */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Categories</h4>
                      <button
                        type="button"
                        onClick={() => addCategory(taskIndex)}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
                      >
                        Add Category
                      </button>
                    </div>

                    {task.config.categories?.map((category, categoryIndex) => (
                      <div
                        key={categoryIndex}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2"
                      >
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Name
                          </label>
                          <input
                            type="text"
                            value={category.name}
                            onChange={(e) =>
                              handleCategoryChange(
                                taskIndex,
                                categoryIndex,
                                "name",
                                e.target.value
                              )
                            }
                            className="w-full p-2 border border-gray-300 rounded"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Description
                          </label>
                          <input
                            type="text"
                            value={category.description}
                            onChange={(e) =>
                              handleCategoryChange(
                                taskIndex,
                                categoryIndex,
                                "description",
                                e.target.value
                              )
                            }
                            className="w-full p-2 border border-gray-300 rounded"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              openMediaUploadModal(
                                `interactiveTaskCategory-${taskIndex}-${categoryIndex}`,
                                "image"
                              )
                            }
                            className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
                          >
                            {category.image ? "Replace Image" : "Add Image"}
                          </button>
                          <span className="text-sm text-gray-500">
                            ID: {category.id}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {task.type === "scenario-choice" && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Scenarios</h4>
                  </div>

                  {task.config.scenarios?.map((scenario, scenarioIndex) => (
                    <div
                      key={scenarioIndex}
                      className="mb-4 p-3 border border-gray-200 rounded"
                    >
                      <h5 className="font-medium mb-2">
                        Scenario {scenarioIndex + 1}: {scenario.text}
                      </h5>

                      {scenario.responses?.map((response, responseIndex) => (
                        <div
                          key={responseIndex}
                          className="flex items-center gap-2 mb-2"
                        >
                          <input
                            type="text"
                            value={response.text}
                            className="flex-1 p-2 border border-gray-300 rounded"
                            readOnly
                          />
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={response.isCorrect}
                              className="mr-1"
                              readOnly
                            />
                            <span className="text-sm">Correct</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {task.type === "chat-simulator" && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Chat Scenarios</h4>
                    <button
                      type="button"
                      onClick={() => {
                        const newScenarios = [...(task.config.scenarios || [])];
                        const newId = `c${newScenarios.length + 1}`;
                        newScenarios.push({
                          id: newId,
                          text: "",
                          situation: "",
                          hint: "",
                          responses: [
                            {
                              id: "r1",
                              text: "",
                              feedback: "",
                              isCorrect: false,
                            },
                          ],
                        });
                        const newTasks = [...formData.interactiveTasks];
                        newTasks[taskIndex].config = {
                          ...newTasks[taskIndex].config,
                          scenarios: newScenarios,
                        };
                        setFormData((prev) => ({
                          ...prev,
                          interactiveTasks: newTasks,
                        }));
                      }}
                      className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      Add Scenario
                    </button>
                  </div>

                  {task.config.scenarios?.map((scenario, scenarioIndex) => (
                    <div
                      key={scenarioIndex}
                      className="mb-4 p-3 border border-gray-200 rounded"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Scenario Text
                          </label>
                          <input
                            type="text"
                            value={scenario.text}
                            onChange={(e) => {
                              const newTasks = [...formData.interactiveTasks];
                              newTasks[taskIndex].config.scenarios[
                                scenarioIndex
                              ].text = e.target.value;
                              setFormData((prev) => ({
                                ...prev,
                                interactiveTasks: newTasks,
                              }));
                            }}
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Brief description of scenario"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Hint
                          </label>
                          <input
                            type="text"
                            value={scenario.hint}
                            onChange={(e) => {
                              const newTasks = [...formData.interactiveTasks];
                              newTasks[taskIndex].config.scenarios[
                                scenarioIndex
                              ].hint = e.target.value;
                              setFormData((prev) => ({
                                ...prev,
                                interactiveTasks: newTasks,
                              }));
                            }}
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Helpful hint for this scenario"
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="block text-sm font-medium mb-1">
                          Situation
                        </label>
                        <textarea
                          value={scenario.situation}
                          onChange={(e) => {
                            const newTasks = [...formData.interactiveTasks];
                            newTasks[taskIndex].config.scenarios[
                              scenarioIndex
                            ].situation = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              interactiveTasks: newTasks,
                            }));
                          }}
                          className="w-full p-2 border border-gray-300 rounded"
                          rows="2"
                          placeholder="Detailed scenario situation"
                        ></textarea>
                      </div>

                      <div className="mb-2">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="font-medium">Responses</h5>
                          <button
                            type="button"
                            onClick={() => {
                              const newTasks = [...formData.interactiveTasks];
                              const newResponses = [
                                ...(newTasks[taskIndex].config.scenarios[
                                  scenarioIndex
                                ].responses || []),
                              ];
                              const newId = `r${newResponses.length + 1}`;
                              newResponses.push({
                                id: newId,
                                text: "",
                                feedback: "",
                                isCorrect: false,
                              });
                              newTasks[taskIndex].config.scenarios[
                                scenarioIndex
                              ].responses = newResponses;
                              setFormData((prev) => ({
                                ...prev,
                                interactiveTasks: newTasks,
                              }));
                            }}
                            className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
                          >
                            Add Response
                          </button>
                        </div>

                        {scenario.responses?.map((response, responseIndex) => (
                          <div
                            key={responseIndex}
                            className="grid grid-cols-1 md:grid-cols-12 gap-2 mb-2 p-2 border border-gray-200 rounded"
                          >
                            <div className="md:col-span-5">
                              <label className="block text-xs font-medium mb-1">
                                Response Text
                              </label>
                              <input
                                type="text"
                                value={response.text}
                                onChange={(e) => {
                                  const newTasks = [
                                    ...formData.interactiveTasks,
                                  ];
                                  newTasks[taskIndex].config.scenarios[
                                    scenarioIndex
                                  ].responses[responseIndex].text =
                                    e.target.value;
                                  setFormData((prev) => ({
                                    ...prev,
                                    interactiveTasks: newTasks,
                                  }));
                                }}
                                className="w-full p-2 border border-gray-300 rounded"
                                placeholder="Response text"
                              />
                            </div>
                            <div className="md:col-span-5">
                              <label className="block text-xs font-medium mb-1">
                                Feedback
                              </label>
                              <input
                                type="text"
                                value={response.feedback}
                                onChange={(e) => {
                                  const newTasks = [
                                    ...formData.interactiveTasks,
                                  ];
                                  newTasks[taskIndex].config.scenarios[
                                    scenarioIndex
                                  ].responses[responseIndex].feedback =
                                    e.target.value;
                                  setFormData((prev) => ({
                                    ...prev,
                                    interactiveTasks: newTasks,
                                  }));
                                }}
                                className="w-full p-2 border border-gray-300 rounded"
                                placeholder="Feedback for this response"
                              />
                            </div>
                            <div className="md:col-span-2 flex items-end">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={`correct-${taskIndex}-${scenarioIndex}-${responseIndex}`}
                                  checked={response.isCorrect}
                                  onChange={(e) => {
                                    const newTasks = [
                                      ...formData.interactiveTasks,
                                    ];
                                    newTasks[taskIndex].config.scenarios[
                                      scenarioIndex
                                    ].responses[responseIndex].isCorrect =
                                      e.target.checked;
                                    setFormData((prev) => ({
                                      ...prev,
                                      interactiveTasks: newTasks,
                                    }));
                                  }}
                                  className="mr-1 h-4 w-4 text-blue-600"
                                />
                                <label
                                  htmlFor={`correct-${taskIndex}-${scenarioIndex}-${responseIndex}`}
                                  className="text-sm"
                                >
                                  Correct
                                </label>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  if (scenario.responses.length > 1) {
                                    const newTasks = [
                                      ...formData.interactiveTasks,
                                    ];
                                    const newResponses = [
                                      ...newTasks[taskIndex].config.scenarios[
                                        scenarioIndex
                                      ].responses,
                                    ];
                                    newTasks[taskIndex].config.scenarios[
                                      scenarioIndex
                                    ].responses = newResponses.filter(
                                      (_, i) => i !== responseIndex
                                    );
                                    setFormData((prev) => ({
                                      ...prev,
                                      interactiveTasks: newTasks,
                                    }));
                                  }
                                }}
                                className="ml-2 bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                                disabled={scenario.responses.length <= 1}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const newTasks = [...formData.interactiveTasks];
                          newTasks[taskIndex].config.scenarios = newTasks[
                            taskIndex
                          ].config.scenarios.filter(
                            (_, i) => i !== scenarioIndex
                          );
                          setFormData((prev) => ({
                            ...prev,
                            interactiveTasks: newTasks,
                          }));
                        }}
                        className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Remove Scenario
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quiz Section */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Quiz</h3>
            <button
              type="button"
              onClick={addQuestion}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Add quiz question"
            >
              Add Question
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="quiz-title"
                className="block text-sm font-medium mb-1"
              >
                Quiz Title
              </label>
              <input
                id="quiz-title"
                type="text"
                value={formData.quiz.title}
                onChange={(e) => handleQuizChange("title", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                aria-describedby="quiz-title-help"
              />
              <p id="quiz-title-help" className="sr-only">
                Enter the quiz title
              </p>
            </div>

            <div>
              <label
                htmlFor="quiz-description"
                className="block text-sm font-medium mb-1"
              >
                Description
              </label>
              <input
                id="quiz-description"
                type="text"
                value={formData.quiz.description}
                onChange={(e) =>
                  handleQuizChange("description", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                aria-describedby="quiz-description-help"
              />
              <p id="quiz-description-help" className="sr-only">
                Enter the quiz description
              </p>
            </div>

            <div>
              <label
                htmlFor="quiz-passing-score"
                className="block text-sm font-medium mb-1"
              >
                Passing Score (%)
              </label>
              <input
                id="quiz-passing-score"
                type="number"
                value={formData.quiz.passingScore}
                onChange={(e) =>
                  handleQuizChange("passingScore", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                aria-describedby="quiz-passing-score-help"
              />
              <p id="quiz-passing-score-help" className="sr-only">
                Enter the passing score percentage
              </p>
            </div>

            <div>
              <label
                htmlFor="quiz-total-points"
                className="block text-sm font-medium mb-1"
              >
                Total Points
              </label>
              <input
                id="quiz-total-points"
                type="number"
                value={formData.quiz.totalPoints}
                onChange={(e) =>
                  handleQuizChange("totalPoints", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                aria-describedby="quiz-total-points-help"
              />
              <p id="quiz-total-points-help" className="sr-only">
                Enter the total points for the quiz
              </p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="allowRetake"
                checked={formData.quiz.allowRetake}
                onChange={(e) =>
                  handleQuizChange("allowRetake", e.target.checked)
                }
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="allowRetake" className="text-sm font-medium">
                Allow Retake
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="showCorrectAnswers"
                checked={formData.quiz.showCorrectAnswers}
                onChange={(e) =>
                  handleQuizChange("showCorrectAnswers", e.target.checked)
                }
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="showCorrectAnswers"
                className="text-sm font-medium"
              >
                Show Correct Answers
              </label>
            </div>
          </div>

          {formData.quiz.questions.map((question, qIndex) => (
            <div
              key={qIndex}
              className="mb-6 p-4 border border-gray-300 rounded"
              role="region"
              aria-labelledby={`quiz-question-${qIndex}-label`}
            >
              <div className="flex justify-between items-center mb-2">
                <h4
                  id={`quiz-question-${qIndex}-label`}
                  className="font-medium"
                >
                  Question {qIndex + 1}
                </h4>
                {formData.quiz.questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(qIndex)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    aria-label={`Remove question ${qIndex + 1}`}
                  >
                    Remove Question
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor={`quiz-question-text-${qIndex}`}
                    className="block text-sm font-medium mb-1"
                  >
                    Question
                  </label>
                  <textarea
                    id={`quiz-question-text-${qIndex}`}
                    value={question.question}
                    onChange={(e) =>
                      handleQuestionChange(qIndex, "question", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    rows="2"
                    aria-describedby={`quiz-question-text-${qIndex}-help`}
                  ></textarea>
                  <p
                    id={`quiz-question-text-${qIndex}-help`}
                    className="sr-only"
                  >
                    Enter the question text
                  </p>
                </div>

                <div>
                  <label
                    htmlFor={`quiz-question-explanation-${qIndex}`}
                    className="block text-sm font-medium mb-1"
                  >
                    Explanation
                  </label>
                  <textarea
                    id={`quiz-question-explanation-${qIndex}`}
                    value={question.explanation}
                    onChange={(e) =>
                      handleQuestionChange(
                        qIndex,
                        "explanation",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    rows="2"
                    aria-describedby={`quiz-question-explanation-${qIndex}-help`}
                  ></textarea>
                  <p
                    id={`quiz-question-explanation-${qIndex}-help`}
                    className="sr-only"
                  >
                    Enter the explanation for this question
                  </p>
                </div>

                <div>
                  <label
                    htmlFor={`quiz-question-type-${qIndex}`}
                    className="block text-sm font-medium mb-1"
                  >
                    Type
                  </label>
                  <select
                    id={`quiz-question-type-${qIndex}`}
                    value={question.type}
                    onChange={(e) =>
                      handleQuestionChange(qIndex, "type", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    aria-describedby={`quiz-question-type-${qIndex}-help`}
                  >
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="true-false">True/False</option>
                    <option value="short-answer">Short Answer</option>
                  </select>
                  <p
                    id={`quiz-question-type-${qIndex}-help`}
                    className="sr-only"
                  >
                    Select the question type
                  </p>
                </div>

                <div>
                  <label
                    htmlFor={`quiz-question-points-${qIndex}`}
                    className="block text-sm font-medium mb-1"
                  >
                    Points
                  </label>
                  <input
                    id={`quiz-question-points-${qIndex}`}
                    type="number"
                    value={question.points}
                    onChange={(e) =>
                      handleQuestionChange(qIndex, "points", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    aria-describedby={`quiz-question-points-${qIndex}-help`}
                  />
                  <p
                    id={`quiz-question-points-${qIndex}-help`}
                    className="sr-only"
                  >
                    Enter the points for this question
                  </p>
                </div>
              </div>

              <div className="mb-2">
                <div className="flex justify-between items-center mb-2">
                  <h5 className="font-medium">Options</h5>
                  <button
                    type="button"
                    onClick={() => addOption(qIndex)}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label={`Add option to question ${qIndex + 1}`}
                  >
                    Add Option
                  </button>
                </div>

                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex gap-2 mb-2">
                    <div className="flex-1">
                      <label
                        htmlFor={`quiz-question-option-${qIndex}-${oIndex}`}
                        className="sr-only"
                      >
                        Option {String.fromCharCode(65 + oIndex)}
                      </label>
                      <input
                        id={`quiz-question-option-${qIndex}-${oIndex}`}
                        type="text"
                        value={option.text}
                        onChange={(e) =>
                          handleOptionChange(
                            qIndex,
                            oIndex,
                            "text",
                            e.target.value
                          )
                        }
                        className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`Option ${String.fromCharCode(
                          65 + oIndex
                        )}`}
                        aria-describedby={`quiz-question-option-${qIndex}-${oIndex}-help`}
                      />
                      <p
                        id={`quiz-question-option-${qIndex}-${oIndex}-help`}
                        className="sr-only"
                      >
                        Enter option {String.fromCharCode(65 + oIndex)} text
                      </p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`correct-${qIndex}-${oIndex}`}
                        checked={option.isCorrect}
                        onChange={(e) =>
                          handleOptionChange(
                            qIndex,
                            oIndex,
                            "isCorrect",
                            e.target.checked
                          )
                        }
                        className="mr-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`correct-${qIndex}-${oIndex}`}
                        className="text-sm"
                      >
                        Correct
                      </label>
                    </div>
                    {question.options.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeOption(qIndex, oIndex)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        aria-label={`Remove option ${String.fromCharCode(
                          65 + oIndex
                        )}`}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Parent Tip */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-4">Parent Tip</h3>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label
                htmlFor="parent-tip-title"
                className="block text-sm font-medium mb-1"
              >
                Title
              </label>
              <input
                id="parent-tip-title"
                type="text"
                value={formData.parentTip.title}
                onChange={(e) => handleParentTipChange("title", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                aria-describedby="parent-tip-title-help"
              />
              <p id="parent-tip-title-help" className="sr-only">
                Enter the parent tip title
              </p>
            </div>

            <div>
              <label
                htmlFor="parent-tip-content"
                className="block text-sm font-medium mb-1"
              >
                Content
              </label>
              <textarea
                id="parent-tip-content"
                value={formData.parentTip.content}
                onChange={(e) =>
                  handleParentTipChange("content", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                rows="4"
                aria-describedby="parent-tip-content-help"
              ></textarea>
              <p id="parent-tip-content-help" className="sr-only">
                Enter the parent tip content
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
            aria-describedby="submit-button-help"
          >
            {isSubmitting ? (
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
                Saving...
              </span>
            ) : (
              "Save Module"
            )}
          </button>
          <p id="submit-button-help" className="sr-only">
            Save the module with all the changes
          </p>
        </div>
      </form>

      {/* Media Upload Modal */}
      <MediaUploadModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onUpload={handleMediaUpload}
        mediaType={currentMediaType}
      />
    </div>
  );
};

export default Sixmodules;
