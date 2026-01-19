import { useState, useEffect } from "react";
import {
  useGetModulesByIdQuery,
  useUpdateModulesOneMutation,
  useUploadContentImageMutation,
  useUploadIntroVideoOrCoverImageMutation,
} from "../../../redux/features/modules/modulesGet";

const Towmodules = () => {
  const id = "695e2fe8eaf052fd70aa958a";
  const { data, isLoading, isError, error } = useGetModulesByIdQuery(id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateModuleOne] = useUpdateModulesOneMutation();
  const [uploadGenImage] = useUploadContentImageMutation();
  const [uploadIntroVideo] = useUploadIntroVideoOrCoverImageMutation();

  const [formData, setFormData] = useState({
    moduleNumber: 2,
    title: "",
    slug: "",
    theme: "",
    description: "",
    status: "draft",
    order: 2,
    learningObjectives: [],
    learningContent: [],
    interactiveTasks: [],
    quiz: {
      title: "",
      description: "",
      passingScore: 75,
      questions: [],
      allowRetake: true,
      showCorrectAnswers: true,
    },
    parentTip: { title: "", content: "" },
    introVideo: {},
    learningContentCover: {},
  });

  useEffect(() => {
    if (data) {
      setFormData({
        moduleNumber: data.moduleNumber,
        title: data.title || "",
        slug: data.slug || "",
        theme: data.theme || "",
        description: data.description || "",
        status: data.status || "draft",
        order: data.order || 2,
        learningObjectives: data.learningObjectives || [],
        learningContent: data.learningContent || [],
        interactiveTasks: data.interactiveTasks || [],
        quiz: {
          title: data.quiz?.title || "",
          description: data.quiz?.description || "",
          passingScore: data.quiz?.passingScore || 75,
          questions: data.quiz?.questions || [],
          allowRetake: data.quiz?.allowRetake ?? true,
          showCorrectAnswers: data.quiz?.showCorrectAnswers ?? true,
        },
        parentTip: {
          title: data.parentTip?.title || "",
          content: data.parentTip?.content || "",
        },
        introVideo: data.introVideo || {},
        learningContentCover: data.learningContentCover || {},
      });
    }
  }, [data]);

  const cloneState = (prev) => JSON.parse(JSON.stringify(prev));

  // Basic input change
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...cloneState(prev), [field]: value }));
  };

  // Nested field change
  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => {
      const cloned = cloneState(prev);
      cloned[section] = { ...cloned[section], [field]: value };
      return cloned;
    });
  };

  // Intro video upload
  const handleIntroVideoUpload = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "video/*";
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      setIsSubmitting(true);
      try {
        const fd = new FormData();
        fd.append("introVideo", file);
        const response = await uploadIntroVideo({ moduleId: id, body: fd }).unwrap();
        setFormData((prev) => ({ ...cloneState(prev), introVideo: response.introVideo }));
        alert("Intro video uploaded successfully!");
      } catch (err) {
        console.error("Video upload error:", err);
        alert("Failed to upload video");
      } finally {
        setIsSubmitting(false);
      }
    };
    fileInput.click();
  };

  // Learning objectives
  const handleObjectiveChange = (index, value) => {
    setFormData((prev) => {
      const cloned = cloneState(prev);
      cloned.learningObjectives[index].text = value;
      return cloned;
    });
  };

  const addObjective = () => {
    setFormData((prev) => {
      const cloned = cloneState(prev);
      cloned.learningObjectives.push({ text: "", order: cloned.learningObjectives.length + 1 });
      return cloned;
    });
  };

  const removeObjective = (index) => {
    setFormData((prev) => {
      const cloned = cloneState(prev);
      cloned.learningObjectives.splice(index, 1);
      cloned.learningObjectives.forEach((obj, i) => (obj.order = i + 1));
      return cloned;
    });
  };

  // Learning content
  const handleContentTextChange = (index, value) => {
    setFormData((prev) => {
      const cloned = cloneState(prev);
      const block = cloned.learningContent[index];
      if (block.type === "text") {
        if (typeof block.content === "object") {
          block.content.text = value;
        } else {
          block.content = { text: value, listItems: [] };
        }
      } else {
        block.content = value;
      }
      return cloned;
    });
  };

  const addContentBlock = (type) => {
    setFormData((prev) => {
      const cloned = cloneState(prev);
      const newBlock = {
        type,
        order: cloned.learningContent.length,
        content: type === "text" ? { text: "", listItems: [] } : "",
      };
      if (type === "image") newBlock.image = { url: "", publicId: "" };
      cloned.learningContent.push(newBlock);
      return cloned;
    });
  };

  const removeContentBlock = (index) => {
    setFormData((prev) => {
      const cloned = cloneState(prev);
      cloned.learningContent.splice(index, 1);
      cloned.learningContent.forEach((block, i) => (block.order = i));
      return cloned;
    });
  };

  const handleContentImageUpload = async (index) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      setIsSubmitting(true);
      try {
        const fd = new FormData();
        fd.append("image", file);
        const imageUrl = await uploadGenImage(fd).unwrap();
        setFormData((prev) => {
          const cloned = cloneState(prev);
          cloned.learningContent[index].image = {
            url: imageUrl,
            publicId: imageUrl.split("/").pop(),
          };
          return cloned;
        });
      } catch (err) {
        console.error("Image upload error:", err);
        alert("Failed to upload image");
      } finally {
        setIsSubmitting(false);
      }
    };
    fileInput.click();
  };

  // Interactive tasks
  const handleTaskChange = (taskIndex, field, value) => {
    setFormData((prev) => {
      const cloned = cloneState(prev);
      cloned.interactiveTasks[taskIndex][field] = value;
      return cloned;
    });
  };

  // Sort-categories items
  const handleItemChange = (taskIndex, itemIndex, field, value) => {
    setFormData((prev) => {
      const cloned = cloneState(prev);
      cloned.interactiveTasks[taskIndex].config.items[itemIndex][field] = value;
      return cloned;
    });
  };

  const addItem = (taskIndex) => {
    setFormData((prev) => {
      const cloned = cloneState(prev);
      const items = cloned.interactiveTasks[taskIndex].config.items || [];
      const newId = `i${items.length + 1}`;
      items.push({ id: newId, name: "", text: "" });
      cloned.interactiveTasks[taskIndex].config.items = items;
      return cloned;
    });
  };

  const removeItem = (taskIndex, itemIndex) => {
    setFormData((prev) => {
      const cloned = cloneState(prev);
      const items = cloned.interactiveTasks[taskIndex].config.items;
      const removedId = items[itemIndex].id;
      items.splice(itemIndex, 1);
      delete cloned.interactiveTasks[taskIndex].config.correctMapping[removedId];
      return cloned;
    });
  };

  // Categories
  const handleCategoryChange = (taskIndex, catIndex, field, value) => {
    setFormData((prev) => {
      const cloned = cloneState(prev);
      cloned.interactiveTasks[taskIndex].config.categories[catIndex][field] = value;
      return cloned;
    });
  };

  const addCategory = (taskIndex) => {
    setFormData((prev) => {
      const cloned = cloneState(prev);
      const cats = cloned.interactiveTasks[taskIndex].config.categories || [];
      const newId = `cat${cats.length + 1}`;
      cats.push({ id: newId, name: "", description: "", image: { url: "" } });
      cloned.interactiveTasks[taskIndex].config.categories = cats;
      return cloned;
    });
  };

  const removeCategory = (taskIndex, catIndex) => {
    setFormData((prev) => {
      const cloned = cloneState(prev);
      const cats = cloned.interactiveTasks[taskIndex].config.categories;
      const removedId = cats[catIndex].id;
      cats.splice(catIndex, 1);
      const mapping = cloned.interactiveTasks[taskIndex].config.correctMapping;
      Object.keys(mapping).forEach((key) => {
        if (mapping[key] === removedId) delete mapping[key];
      });
      return cloned;
    });
  };

  const handleCategoryImageUpload = async (taskIndex, catIndex) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      setIsSubmitting(true);
      try {
        const fd = new FormData();
        fd.append("image", file);
        const imageUrl = await uploadGenImage(fd).unwrap();
        setFormData((prev) => {
          const cloned = cloneState(prev);
          cloned.interactiveTasks[taskIndex].config.categories[catIndex].image = {
            url: imageUrl,
            publicId: imageUrl.split("/").pop(),
          };
          return cloned;
        });
      } catch (err) {
        console.error("Image upload error:", err);
        alert("Failed to upload image");
      } finally {
        setIsSubmitting(false);
      }
    };
    fileInput.click();
  };

  // Correct mapping
  const handleMappingChange = (taskIndex, itemId, categoryId) => {
    setFormData((prev) => {
      const cloned = cloneState(prev);
      cloned.interactiveTasks[taskIndex].config.correctMapping[itemId] = categoryId;
      return cloned;
    });
  };

  // Scenario-choice scenarios
  const handleScenarioChange = (taskIndex, scenarioIndex, field, value) => {
    setFormData((prev) => {
      const cloned = cloneState(prev);
      cloned.interactiveTasks[taskIndex].config.scenarios[scenarioIndex][field] = value;
      return cloned;
    });
  };

  const addScenario = (taskIndex) => {
    setFormData((prev) => {
      const cloned = cloneState(prev);
      const scenarios = cloned.interactiveTasks[taskIndex].config.scenarios || [];
      const newId = `s${scenarios.length + 1}`;
      scenarios.push({
        id: newId,
        text: "",
        situation: "",
        responses: [],
        options: [
          { id: "o1", text: "", feedback: "", isCorrect: false },
          { id: "o2", text: "", feedback: "", isCorrect: false },
        ],
      });
      cloned.interactiveTasks[taskIndex].config.scenarios = scenarios;
      return cloned;
    });
  };

  const removeScenario = (taskIndex, scenarioIndex) => {
    setFormData((prev) => {
      const cloned = cloneState(prev);
      cloned.interactiveTasks[taskIndex].config.scenarios.splice(scenarioIndex, 1);
      return cloned;
    });
  };

  // Scenario options
  const handleScenarioOptionChange = (taskIndex, scenarioIndex, optIndex, field, value) => {
    setFormData((prev) => {
      const cloned = cloneState(prev);
      const options = cloned.interactiveTasks[taskIndex].config.scenarios[scenarioIndex].options;
      if (field === "isCorrect" && value) {
        options.forEach((opt) => (opt.isCorrect = false));
      }
      options[optIndex][field] = value;
      return cloned;
    });
  };

  const addScenarioOption = (taskIndex, scenarioIndex) => {
    setFormData((prev) => {
      const cloned = cloneState(prev);
      const options = cloned.interactiveTasks[taskIndex].config.scenarios[scenarioIndex].options;
      const newId = `o${options.length + 1}`;
      options.push({ id: newId, text: "", feedback: "", isCorrect: false });
      return cloned;
    });
  };

  const removeScenarioOption = (taskIndex, scenarioIndex, optIndex) => {
    setFormData((prev) => {
      const cloned = cloneState(prev);
      cloned.interactiveTasks[taskIndex].config.scenarios[scenarioIndex].options.splice(optIndex, 1);
      return cloned;
    });
  };

  // Quiz
  const handleQuestionChange = (qIndex, field, value) => {
    setFormData((prev) => {
      const cloned = cloneState(prev);
      cloned.quiz.questions[qIndex][field] = value;
      return cloned;
    });
  };

  const handleOptionChange = (qIndex, optIndex, field, value) => {
    setFormData((prev) => {
      const cloned = cloneState(prev);
      const options = cloned.quiz.questions[qIndex].options;
      if (field === "isCorrect" && value) {
        options.forEach((opt) => (opt.isCorrect = false));
        cloned.quiz.questions[qIndex].correctAnswer = options[optIndex].id;
      }
      options[optIndex][field] = value;
      return cloned;
    });
  };

  const addQuestion = () => {
    setFormData((prev) => {
      const cloned = cloneState(prev);
      const num = cloned.quiz.questions.length + 1;
      cloned.quiz.questions.push({
        questionNumber: num,
        type: "multiple-choice",
        question: "",
        options: [
          { id: "A", text: "", isCorrect: false },
          { id: "B", text: "", isCorrect: false },
          { id: "C", text: "", isCorrect: false },
        ],
        correctAnswer: "",
        explanation: "",
        points: 5,
      });
      return cloned;
    });
  };

  const removeQuestion = (qIndex) => {
    setFormData((prev) => {
      const cloned = cloneState(prev);
      cloned.quiz.questions.splice(qIndex, 1);
      cloned.quiz.questions.forEach((q, i) => (q.questionNumber = i + 1));
      return cloned;
    });
  };

  const addOption = (qIndex) => {
    setFormData((prev) => {
      const cloned = cloneState(prev);
      const options = cloned.quiz.questions[qIndex].options;
      const newId = String.fromCharCode(65 + options.length);
      options.push({ id: newId, text: "", isCorrect: false });
      return cloned;
    });
  };

  const removeOption = (qIndex, optIndex) => {
    setFormData((prev) => {
      const cloned = cloneState(prev);
      cloned.quiz.questions[qIndex].options.splice(optIndex, 1);
      return cloned;
    });
  };

  // Format data for API
  const formatDataForUpdate = () => {
    const objectives = formData.learningObjectives.map((obj) => obj.text);

    const content = formData.learningContent.map((block) => {
      const contentBlock = {
        type: block.type,
        order: block.order,
        content:
          block.type === "text"
            ? typeof block.content === "object"
              ? block.content.text
              : block.content
            : typeof block.content === "string"
            ? block.content
            : "",
      };

      // Include image if block type is image and has image data
      if (block.type === "image" && block.image?.url) {
        contentBlock.image = {
          url: block.image.url,
          publicId: block.image.publicId,
        };
      }

      return contentBlock;
    });

    const tasks = formData.interactiveTasks.map((task) => {
      const base = {
        type: task.type,
        title: task.title,
        description: task.description,
        instructions: task.instructions,
        points: task.points,
      };

      if (task.type === "sort-categories") {
        base.items = task.config.items.map((it) => ({ id: it.id, name: it.name, text: it.text }));
        base.categories = task.config.categories.map((cat) => {
          const category = {
            id: cat.id,
            name: cat.name,
            description: cat.description,
          };
          // Include image if category has image data
          if (cat.image?.url) {
            category.image = {
              url: cat.image.url,
              publicId: cat.image.publicId,
            };
          }
          return category;
        });
        base.correctMapping = { ...task.config.correctMapping };
      }

      if (task.type === "scenario-choice") {
        base.scenarios = task.config.scenarios.map((sc) => ({
          id: sc.id,
          situation: sc.situation || sc.text,
          options: sc.options.map((opt) => ({
            id: opt.id,
            text: opt.text,
            isCorrect: opt.isCorrect,
            feedback: opt.feedback,
          })),
        }));
      }

      return base;
    });

    const quiz = {
      title: formData.quiz.title,
      description: formData.quiz.description,
      passingScore: formData.quiz.passingScore,
      allowRetake: formData.quiz.allowRetake,
      showCorrectAnswers: formData.quiz.showCorrectAnswers,
      questions: formData.quiz.questions.map((q) => ({
        questionNumber: q.questionNumber,
        type: "multiple-choice",
        question: q.question,
        points: q.points,
        explanation: q.explanation,
        options: q.options.map((opt) => ({
          id: opt.id,
          text: opt.text,
          isCorrect: opt.isCorrect,
        })),
      })),
    };

    return {
      moduleNumber: formData.moduleNumber,
      title: formData.title,
      theme: formData.theme,
      description: formData.description,
      slug: formData.slug,
      status: formData.status,
      order: formData.order,
      learningObjectives: objectives,
      learningContent: content,
      interactiveTasks: tasks,
      quiz,
      parentTip: {
        title: formData.parentTip.title,
        content: formData.parentTip.content,
      },
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const updatedData = formatDataForUpdate();
      await updateModuleOne({ id, updatedData }).unwrap();
      alert("Module updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update module");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (isError) return <div className="p-6 text-red-500">Error: {error?.message}</div>;

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Edit Module: {formData.title}</h2>

      <form onSubmit={handleSubmit}>
        {/* Module Information */}
        <section className="mb-8 p-4 border rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Module Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Module Number (Read-only)</label>
              <input type="text" value={formData.moduleNumber} readOnly className="w-full px-3 py-2 border rounded bg-gray-100" />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Order (Read-only)</label>
              <input type="text" value={formData.order} readOnly className="w-full px-3 py-2 border rounded bg-gray-100" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
            <input type="text" value={formData.title} onChange={(e) => handleInputChange("title", e.target.value)} className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Slug</label>
            <input type="text" value={formData.slug} onChange={(e) => handleInputChange("slug", e.target.value)} className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Theme</label>
            <input type="text" value={formData.theme} onChange={(e) => handleInputChange("theme", e.target.value)} className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
            <textarea value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} rows="3" className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
            <select value={formData.status} onChange={(e) => handleInputChange("status", e.target.value)} className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </section>

        {/* Intro Video */}
        <section className="mb-8 p-4 border rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Intro Video</h3>
          {formData.introVideo?.url ? (
            <div className="mb-4">
              <video controls className="w-full max-w-md h-auto rounded border">
                <source src={formData.introVideo.url} type="video/mp4" />
              </video>
            </div>
          ) : (
            <p className="text-gray-500 italic mb-4">No intro video uploaded</p>
          )}
          <button type="button" onClick={handleIntroVideoUpload} disabled={isSubmitting} className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}>
            {isSubmitting ? "Uploading..." : "Upload/Replace Intro Video"}
          </button>
        </section>

        {/* Learning Objectives */}
        <section className="mb-8 p-4 border rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Learning Objectives</h3>
            <button type="button" onClick={addObjective} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">Add Objective</button>
          </div>
          {formData.learningObjectives.map((obj, index) => (
            <div key={index} className="mb-3 flex items-center gap-2">
              <span className="text-gray-500 font-medium">{index + 1}.</span>
              <input type="text" value={obj.text} onChange={(e) => handleObjectiveChange(index, e.target.value)} className="flex-1 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" placeholder="Enter learning objective" />
              <button type="button" onClick={() => removeObjective(index)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Remove</button>
            </div>
          ))}
        </section>

        {/* Learning Content */}
        <section className="mb-8 p-4 border rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Learning Content</h3>
            <div className="flex gap-2">
              <button type="button" onClick={() => addContentBlock("text")} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">Add Text</button>
              <button type="button" onClick={() => addContentBlock("image")} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">Add Image</button>
            </div>
          </div>
          {formData.learningContent.map((block, index) => (
            <div key={index} className="mb-6 p-4 border rounded">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">Block {index + 1} ({block.type})</h4>
                <button type="button" onClick={() => removeContentBlock(index)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Remove</button>
              </div>
              {block.type === "image" && (
                <div className="mb-4">
                  <div className="flex items-center gap-4 mb-3">
                    {block.image?.url ? (
                      <img src={block.image.url} alt="Content" className="w-32 h-32 object-cover border rounded" />
                    ) : (
                      <div className="w-32 h-32 bg-gray-200 border rounded flex items-center justify-center text-gray-500">No image</div>
                    )}
                    <button type="button" onClick={() => handleContentImageUpload(index)} disabled={isSubmitting} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">
                      {block.image?.url ? "Change Image" : "Upload Image"}
                    </button>
                  </div>
                </div>
              )}
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Content Text</label>
                <textarea
                  value={block.type === "text" ? (typeof block.content === "object" ? block.content.text : block.content) : block.content}
                  onChange={(e) => handleContentTextChange(index, e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}
        </section>

        {/* Interactive Tasks */}
        <section className="mb-8 p-4 border rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Interactive Tasks</h3>
          {formData.interactiveTasks.map((task, taskIndex) => (
            <div key={taskIndex} className="mb-6 p-4 border rounded bg-gray-50">
              <h4 className="font-semibold text-lg mb-4">Task {taskIndex + 1}: {task.title} ({task.type})</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
                  <input type="text" value={task.title} onChange={(e) => handleTaskChange(taskIndex, "title", e.target.value)} className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Points</label>
                  <input type="number" value={task.points} onChange={(e) => handleTaskChange(taskIndex, "points", parseFloat(e.target.value))} className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                <textarea value={task.description} onChange={(e) => handleTaskChange(taskIndex, "description", e.target.value)} rows="2" className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Instructions</label>
                <textarea value={task.instructions} onChange={(e) => handleTaskChange(taskIndex, "instructions", e.target.value)} rows="2" className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" />
              </div>

              {/* Sort-categories */}
              {task.type === "sort-categories" && task.config && (
                <>
                  {/* Items */}
                  <div className="mb-6 p-3 border rounded bg-white">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="font-medium">Items</h5>
                      <button type="button" onClick={() => addItem(taskIndex)} className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm">Add Item</button>
                    </div>
                    {task.config.items?.map((item, itemIndex) => (
                      <div key={itemIndex} className="mb-3 p-2 border rounded flex items-center gap-2">
                        <input type="text" value={item.name} onChange={(e) => handleItemChange(taskIndex, itemIndex, "name", e.target.value)} placeholder="Name" className="w-32 px-2 py-1 border rounded" />
                        <input type="text" value={item.text} onChange={(e) => handleItemChange(taskIndex, itemIndex, "text", e.target.value)} placeholder="Description" className="flex-1 px-2 py-1 border rounded" />
                        <select value={task.config.correctMapping?.[item.id] || ""} onChange={(e) => handleMappingChange(taskIndex, item.id, e.target.value)} className="w-40 px-2 py-1 border rounded">
                          <option value="">Select Category</option>
                          {task.config.categories?.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                        <button type="button" onClick={() => removeItem(taskIndex, itemIndex)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm">X</button>
                      </div>
                    ))}
                  </div>

                  {/* Categories */}
                  <div className="mb-4 p-3 border rounded bg-white">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="font-medium">Categories</h5>
                      <button type="button" onClick={() => addCategory(taskIndex)} className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm">Add Category</button>
                    </div>
                    {task.config.categories?.map((cat, catIndex) => (
                      <div key={catIndex} className="mb-3 p-2 border rounded flex items-center gap-2">
                        {cat.image?.url ? (
                          <img src={cat.image.url} alt={cat.name} className="w-12 h-12 object-cover border rounded" />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 border rounded flex items-center justify-center text-xs">No img</div>
                        )}
                        <button type="button" onClick={() => handleCategoryImageUpload(taskIndex, catIndex)} className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs">Upload</button>
                        <input type="text" value={cat.name} onChange={(e) => handleCategoryChange(taskIndex, catIndex, "name", e.target.value)} placeholder="Name" className="w-32 px-2 py-1 border rounded" />
                        <input type="text" value={cat.description} onChange={(e) => handleCategoryChange(taskIndex, catIndex, "description", e.target.value)} placeholder="Description" className="flex-1 px-2 py-1 border rounded" />
                        <button type="button" onClick={() => removeCategory(taskIndex, catIndex)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm">X</button>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Scenario-choice */}
              {task.type === "scenario-choice" && task.config && (
                <div className="p-3 border rounded bg-white">
                  <div className="flex justify-between items-center mb-3">
                    <h5 className="font-medium">Scenarios</h5>
                    <button type="button" onClick={() => addScenario(taskIndex)} className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm">Add Scenario</button>
                  </div>
                  {task.config.scenarios?.map((scenario, scIndex) => (
                    <div key={scIndex} className="mb-4 p-3 border rounded bg-gray-50">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Scenario {scIndex + 1}</span>
                        <button type="button" onClick={() => removeScenario(taskIndex, scIndex)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm">Remove</button>
                      </div>
                      <div className="mb-3">
                        <label className="block text-gray-700 text-sm font-bold mb-1">Situation/Question</label>
                        <input type="text" value={scenario.situation || scenario.text} onChange={(e) => handleScenarioChange(taskIndex, scIndex, "situation", e.target.value)} className="w-full px-2 py-1 border rounded" />
                      </div>
                      <div className="mb-2">
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-bold">Options</label>
                          <button type="button" onClick={() => addScenarioOption(taskIndex, scIndex)} className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs">Add Option</button>
                        </div>
                        {scenario.options?.map((opt, optIndex) => (
                          <div key={optIndex} className="mb-2 p-2 border rounded flex items-start gap-2 bg-white">
                            <div className="flex-1">
                              <input type="text" value={opt.text} onChange={(e) => handleScenarioOptionChange(taskIndex, scIndex, optIndex, "text", e.target.value)} placeholder="Option text" className="w-full px-2 py-1 border rounded mb-1" />
                              <input type="text" value={opt.feedback} onChange={(e) => handleScenarioOptionChange(taskIndex, scIndex, optIndex, "feedback", e.target.value)} placeholder="Feedback" className="w-full px-2 py-1 border rounded text-sm" />
                            </div>
                            <label className="flex items-center gap-1 text-sm">
                              <input type="radio" name={`correct-${taskIndex}-${scIndex}`} checked={opt.isCorrect} onChange={() => handleScenarioOptionChange(taskIndex, scIndex, optIndex, "isCorrect", true)} />
                              Correct
                            </label>
                            <button type="button" onClick={() => removeScenarioOption(taskIndex, scIndex, optIndex)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs">X</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>

        {/* Quiz */}
        <section className="mb-8 p-4 border rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Quiz</h3>
            <button type="button" onClick={addQuestion} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">Add Question</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Quiz Title</label>
              <input type="text" value={formData.quiz.title} onChange={(e) => handleNestedChange("quiz", "title", e.target.value)} className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Passing Score (%)</label>
              <input type="number" value={formData.quiz.passingScore} onChange={(e) => handleNestedChange("quiz", "passingScore", parseInt(e.target.value))} className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
            <textarea value={formData.quiz.description} onChange={(e) => handleNestedChange("quiz", "description", e.target.value)} rows="2" className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex gap-4 mb-6">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={formData.quiz.allowRetake} onChange={(e) => handleNestedChange("quiz", "allowRetake", e.target.checked)} />
              Allow Retake
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={formData.quiz.showCorrectAnswers} onChange={(e) => handleNestedChange("quiz", "showCorrectAnswers", e.target.checked)} />
              Show Correct Answers
            </label>
          </div>

          {formData.quiz.questions.map((q, qIndex) => (
            <div key={qIndex} className="mb-6 p-4 border rounded bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">Question {q.questionNumber}</h4>
                <button type="button" onClick={() => removeQuestion(qIndex)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Remove</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Type</label>
                  <input type="text" value="multiple-choice" readOnly className="w-full px-3 py-2 border rounded bg-gray-100" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Points</label>
                  <input type="number" value={q.points} onChange={(e) => handleQuestionChange(qIndex, "points", parseFloat(e.target.value))} className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Question Text</label>
                <textarea value={q.question} onChange={(e) => handleQuestionChange(qIndex, "question", e.target.value)} rows="2" className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Explanation</label>
                <textarea value={q.explanation} onChange={(e) => handleQuestionChange(qIndex, "explanation", e.target.value)} rows="2" className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-gray-700 text-sm font-bold">Options (Select one as correct)</label>
                  <button type="button" onClick={() => addOption(qIndex)} className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm">Add Option</button>
                </div>
                {q.options.map((opt, optIndex) => (
                  <div key={optIndex} className="mb-2 p-2 border rounded flex items-center gap-2 bg-white">
                    <span className="font-medium w-8">{opt.id}.</span>
                    <input type="text" value={opt.text} onChange={(e) => handleOptionChange(qIndex, optIndex, "text", e.target.value)} className="flex-1 px-2 py-1 border rounded" placeholder="Option text" />
                    <label className="flex items-center gap-1 text-sm">
                      <input type="radio" name={`quiz-correct-${qIndex}`} checked={opt.isCorrect} onChange={() => handleOptionChange(qIndex, optIndex, "isCorrect", true)} />
                      Correct
                    </label>
                    <button type="button" onClick={() => removeOption(qIndex, optIndex)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm">X</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Parent Tip */}
        <section className="mb-8 p-4 border rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Parent Tip</h3>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
            <input type="text" value={formData.parentTip.title} onChange={(e) => handleNestedChange("parentTip", "title", e.target.value)} className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Content</label>
            <textarea value={formData.parentTip.content} onChange={(e) => handleNestedChange("parentTip", "content", e.target.value)} rows="4" className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" />
          </div>
        </section>

        {/* Submit */}
        <div className="flex justify-end">
          <button type="submit" disabled={isSubmitting} className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}>
            {isSubmitting ? "Updating..." : "Update Module"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Towmodules;
