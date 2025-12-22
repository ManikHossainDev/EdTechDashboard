import { useState, useEffect } from "react";
import {
  useGetModulesOneByIdQuery,
  useUpdateModulesOneMutation,
} from "../../../redux/features/modules/modulesOne";

const Onemodules = () => {
  const id = "69351cf24826bf0c83d19eef";
  const { data, isLoading, isError, error } = useGetModulesOneByIdQuery(id);

  // Handle form submission - moved to top to maintain consistent hook order
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateModuleOne] = useUpdateModulesOneMutation();

  // Optimized data transformation function
  const transformApiData = (apiData) => {
    if (!apiData?.data) return null;

    const moduleData = apiData.data;

    // Format learning objectives
    const formattedLearningObjectives =
      moduleData.learningObjectives?.map((obj) => obj.text) || [];

    // Format learning content as content blocks
    const formattedContentBlocks =
      moduleData.learningContent?.map((content, index) => ({
        type: content.type || "text",
        order: content.order || index + 1,
        content: content.content?.text || "",
        listItems: content.content?.listItems || [],
      })) || [];

    // Format interactive task
    const formattedInteractiveTask = {
      type: moduleData.interactiveTask?.type || "drag-drop",
      title: moduleData.interactiveTask?.title || "",
      description: moduleData.interactiveTask?.description || "",
      instructions: moduleData.interactiveTask?.instructions || "",
      points: moduleData.interactiveTask?.points || 20,
      items:
        moduleData.interactiveTask?.config?.items?.map((item) => ({
          id: item.id,
          text: item.text,
          image: item.image,
        })) || [],
      categories:
        moduleData.interactiveTask?.config?.categories?.map((category) => ({
          id: category.id,
          name: category.name,
          description: category.description,
        })) || [],
      correctMapping: moduleData.interactiveTask?.config?.correctMapping || {},
    };

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
      interactiveTask: formattedInteractiveTask,
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
      interactiveTask: {
        type: "drag-drop",
        title: "",
        description: "",
        instructions: "",
        points: 20,
        items: [{ id: "1", text: "", image: null }],
        categories: [
          { id: "safe", name: "Safe", description: "This is okay" },
          {
            id: "unsure",
            name: "Unsure",
            description: "Not sure and confused",
          },
          {
            id: "tell-adult",
            name: "Tell an Adult",
            description: "Talk to a trusted adult",
          },
        ],
        correctMapping: {},
      },
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
    interactiveTask: formattedData?.interactiveTask,
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
        { type: "text", order: newOrder, content: "" },
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

  // Handle interactive task changes
  const handleInteractiveTaskChange = (field, value) => {
    setFormData((prev) => {
      const updatedData = {
        ...prev,
        interactiveTask: {
          ...prev.interactiveTask,
          [field]: value,
        },
      };
      // Console log the updated values when interactive task changes
      console.log("Updated interactive task field:", field, "to:", value);
      console.log("Current interactive task:", updatedData.interactiveTask);
      return updatedData;
    });
  };

  const handleInteractiveItemChange = (index, field, value) => {
    const newItems = [...formData.interactiveTask.items];
    newItems[index][field] = value;
    setFormData((prev) => {
      const updatedData = {
        ...prev,
        interactiveTask: {
          ...prev.interactiveTask,
          items: newItems,
        },
      };
      // Console log the updated values when interactive item changes
      console.log(
        "Updated interactive item at index:",
        index,
        "field:",
        field,
        "to:",
        value
      );
      console.log("Current interactive items:", newItems);
      return updatedData;
    });
  };

  const addInteractiveItem = () => {
    const newId = (formData.interactiveTask.items.length + 1).toString();
    setFormData((prev) => ({
      ...prev,
      interactiveTask: {
        ...prev.interactiveTask,
        items: [...prev.interactiveTask.items, { id: newId, text: "" }],
      },
    }));
  };

  const removeInteractiveItem = (index) => {
    const newItems = formData.interactiveTask.items.filter(
      (_, i) => i !== index
    );
    setFormData((prev) => ({
      ...prev,
      interactiveTask: {
        ...prev.interactiveTask,
        items: newItems,
      },
    }));
  };

  const handleCategoryChange = (index, field, value) => {
    const newCategories = [...formData.interactiveTask.categories];
    newCategories[index][field] = value;
    setFormData((prev) => {
      const updatedData = {
        ...prev,
        interactiveTask: {
          ...prev.interactiveTask,
          categories: newCategories,
        },
      };
      // Console log the updated values when category changes
      console.log(
        "Updated category at index:",
        index,
        "field:",
        field,
        "to:",
        value
      );
      console.log("Current categories:", newCategories);
      return updatedData;
    });
  };

  const handleCorrectMappingChange = (itemId, categoryId) => {
    setFormData((prev) => {
      const updatedData = {
        ...prev,
        interactiveTask: {
          ...prev.interactiveTask,
          correctMapping: {
            ...prev.interactiveTask.correctMapping,
            [itemId]: categoryId,
          },
        },
      };
      // Console log the updated values when correct mapping changes
      console.log(
        "Updated correct mapping for item:",
        itemId,
        "to category:",
        categoryId
      );
      console.log(
        "Current correct mapping:",
        updatedData.interactiveTask.correctMapping
      );
      return updatedData;
    });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create the final data object in the required format
    const updatedData = {
      moduleNumber: parseInt(formData.moduleNumber),
      title: formData.title,
      theme: formData.theme,
      description: formData.description,
      slug: formData.slug,
      status: formData.status,
      order: parseInt(formData.order),
      learningObjectives: formData.learningObjectives.filter(
        (obj) => obj.trim() !== ""
      ),
      contentBlocks: formData.contentBlocks
        .filter((block) => block.content.trim() !== "")
        .map((block) => ({
          type: block.type,
          order: parseInt(block.order),
          content: block.content,
        })),
      interactiveTask: {
        type: formData.interactiveTask.type,
        title: formData.interactiveTask.title,
        description: formData.interactiveTask.description,
        instructions: formData.interactiveTask.instructions,
        points: parseInt(formData.interactiveTask.points),
        items: formData.interactiveTask.items
          .filter((item) => item.text.trim() !== "")
          .map((item) => ({
            id: item.id,
            text: item.text,
          })),
        categories: formData.interactiveTask.categories
          .filter((cat) => cat.name.trim() !== "")
          .map((category) => ({
            id: category.id,
            name: category.name,
            description: category.description,
          })),
        correctMapping: formData.interactiveTask.correctMapping,
      },
      quiz: {
        title: formData.quiz.title,
        description: formData.quiz.description,
        passingScore: parseInt(formData.quiz.passingScore),
        totalPoints: 20, // Set to 20 as shown in the required format
        allowRetake: formData.quiz.allowRetake,
        showCorrectAnswers: formData.quiz.showCorrectAnswers,
        questions: formData.quiz.questions
          .filter((q) => q.question.trim() !== "")
          .map((q, idx) => ({
            questionNumber: idx + 1,
            type: q.type,
            question: q.question,
            points: 10, // Set to 10 as shown in the required format
            explanation: q.explanation,
            options: q.options
              .filter((opt) => opt.text.trim() !== "")
              .map((option) => ({
                id: option.id,
                text: option.text,
                isCorrect: option.isCorrect,
              })),
          })),
      },
      parentTip: {
        title: formData.parentTip.title,
        content: formData.parentTip.content,
        additionalResources: formData.parentTip.additionalResources,
      },
    };

    console.log("Module Data:", updatedData);
    try {
      const res = await updateModuleOne({ id, updatedData });
      console.log(res, "im the api response");
    } catch (error) {
      alert("Error to Update");
    }
    alert("Data logged to console!");
    setIsSubmitting(false);
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create Module</h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Module Info */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-4">Module Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Module Number
              </label>
              <input
                type="number"
                name="moduleNumber"
                value={formData.moduleNumber}
                onChange={handleMainChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleMainChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Theme</label>
              <input
                type="text"
                name="theme"
                value={formData.theme}
                onChange={handleMainChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleMainChange}
                className="w-full p-2 border border-gray-300 rounded"
                rows="3"
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Slug</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleMainChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleMainChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Order</label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleMainChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
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
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Add Objective
            </button>
          </div>

          {formData.learningObjectives.map((objective, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={objective}
                onChange={(e) =>
                  handleLearningObjectiveChange(index, e.target.value)
                }
                className="flex-1 p-2 border border-gray-300 rounded"
                placeholder={`Objective ${index + 1}`}
              />
              {formData.learningObjectives.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLearningObjective(index)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Add Block
            </button>
          </div>

          {formData.contentBlocks.map((block, index) => (
            <div
              key={index}
              className="mb-4 p-4 border border-gray-200 rounded"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Block {index + 1}</span>
                {formData.contentBlocks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeContentBlock(index)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    value={block.type}
                    onChange={(e) =>
                      handleContentBlockChange(index, "type", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="text">Text</option>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="audio">Audio</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Order
                  </label>
                  <input
                    type="number"
                    value={block.order}
                    onChange={(e) =>
                      handleContentBlockChange(index, "order", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>

              <div className="mt-2">
                <label className="block text-sm font-medium mb-1">
                  Content
                </label>
                <textarea
                  value={block.content}
                  onChange={(e) =>
                    handleContentBlockChange(index, "content", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                  rows="3"
                ></textarea>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Task */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-4">
            Interactive Task (Drag-Drop)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={formData.interactiveTask.title}
                onChange={(e) =>
                  handleInteractiveTaskChange("title", e.target.value)
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
                value={formData.interactiveTask.description}
                onChange={(e) =>
                  handleInteractiveTaskChange("description", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Instructions
              </label>
              <input
                type="text"
                value={formData.interactiveTask.instructions}
                onChange={(e) =>
                  handleInteractiveTaskChange("instructions", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Points</label>
              <input
                type="number"
                value={formData.interactiveTask.points}
                onChange={(e) =>
                  handleInteractiveTaskChange("points", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">Items</h4>
              <button
                type="button"
                onClick={addInteractiveItem}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Add Item
              </button>
            </div>

            {formData.interactiveTask.items.map((item, index) => (
              <div key={item.id} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) =>
                    handleInteractiveItemChange(index, "text", e.target.value)
                  }
                  className="flex-1 p-2 border border-gray-300 rounded"
                  placeholder={`Item ${index + 1}`}
                />
                <select
                  value={formData.interactiveTask.correctMapping[item.id] || ""}
                  onChange={(e) =>
                    handleCorrectMappingChange(item.id, e.target.value)
                  }
                  className="p-2 border border-gray-300 rounded"
                >
                  <option value="">Select Category</option>
                  {formData.interactiveTask.categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {formData.interactiveTask.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeInteractiveItem(index)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          <div>
            <h4 className="font-medium mb-2">Categories</h4>

            {formData.interactiveTask.categories.map((category, index) => (
              <div
                key={category.id}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2"
              >
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={category.name}
                    onChange={(e) =>
                      handleCategoryChange(index, "name", e.target.value)
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
                      handleCategoryChange(index, "description", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-end">
                  <span className="text-sm text-gray-500">
                    ID: {category.id}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quiz Section */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Quiz</h3>
            <button
              type="button"
              onClick={addQuestion}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Add Question
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Quiz Title
              </label>
              <input
                type="text"
                value={formData.quiz.title}
                onChange={(e) => handleQuizChange("title", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <input
                type="text"
                value={formData.quiz.description}
                onChange={(e) =>
                  handleQuizChange("description", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Passing Score (%)
              </label>
              <input
                type="number"
                value={formData.quiz.passingScore}
                onChange={(e) =>
                  handleQuizChange("passingScore", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Total Points
              </label>
              <input
                type="number"
                value={formData.quiz.totalPoints}
                onChange={(e) =>
                  handleQuizChange("totalPoints", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="allowRetake"
                checked={formData.quiz.allowRetake}
                onChange={(e) =>
                  handleQuizChange("allowRetake", e.target.checked)
                }
                className="mr-2"
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
                className="mr-2"
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
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Question {qIndex + 1}</span>
                {formData.quiz.questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(qIndex)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Remove Question
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Question
                  </label>
                  <textarea
                    value={question.question}
                    onChange={(e) =>
                      handleQuestionChange(qIndex, "question", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                    rows="2"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Explanation
                  </label>
                  <textarea
                    value={question.explanation}
                    onChange={(e) =>
                      handleQuestionChange(
                        qIndex,
                        "explanation",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                    rows="2"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    value={question.type}
                    onChange={(e) =>
                      handleQuestionChange(qIndex, "type", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="true-false">True/False</option>
                    <option value="short-answer">Short Answer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Points
                  </label>
                  <input
                    type="number"
                    value={question.points}
                    onChange={(e) =>
                      handleQuestionChange(qIndex, "points", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>

              <div className="mb-2">
                <div className="flex justify-between items-center mb-2">
                  <h5 className="font-medium">Options</h5>
                  <button
                    type="button"
                    onClick={() => addOption(qIndex)}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
                  >
                    Add Option
                  </button>
                </div>

                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex gap-2 mb-2">
                    <input
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
                      className="flex-1 p-2 border border-gray-300 rounded"
                      placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                    />
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
                        className="mr-1"
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
                        className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
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
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={formData.parentTip.title}
                onChange={(e) => handleParentTipChange("title", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Content</label>
              <textarea
                value={formData.parentTip.content}
                onChange={(e) =>
                  handleParentTipChange("content", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded"
                rows="4"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
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
        </div>
      </form>
    </div>
  );
};

export default Onemodules;
