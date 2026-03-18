import { useState, useEffect } from "react";
import {
  useGetModulesByIdQuery,
  useUpdateModulesOneMutation,
  useUploadContentImageMutation,
  useUploadIntroVideoOrCoverImageMutation,
} from "../../../redux/features/modules/modulesGet";
import { toast } from "sonner";

const Eightmodules = () => {
  const id = "6936776976dca28d7e43e6c7";
  const { data, isLoading, isError, error } = useGetModulesByIdQuery(id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateModuleOne] = useUpdateModulesOneMutation();
  const [uploadGenImage] = useUploadContentImageMutation();
  const [uploadIntroVideo] = useUploadIntroVideoOrCoverImageMutation();

  const [formData, setFormData] = useState({
    moduleNumber: 8,
    title: "",
    slug: "",
    theme: "",
    description: "",
    status: "draft",
    order: 8,
    learningObjectives: [],
    learningContent: [],
    interactiveTasks: [],
    quiz: {
      title: "",
      description: "",
      passingScore: 70,
      questions: [],
      allowRetake: true,
      showCorrectAnswers: true,
    },
    parentTip: { title: "", content: "" },
    introVideo: {},
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
        order: data.order || 8,
        learningObjectives: data.learningObjectives || [],
        learningContent: data.learningContent || [],
        interactiveTasks: data.interactiveTasks || [],
        quiz: {
          title: data.quiz?.title || "",
          description: data.quiz?.description || "",
          passingScore: data.quiz?.passingScore || 70,
          questions: data.quiz?.questions || [],
          allowRetake: data.quiz?.allowRetake ?? true,
          showCorrectAnswers: data.quiz?.showCorrectAnswers ?? true,
        },
        parentTip: {
          title: data.parentTip?.title || "",
          content: data.parentTip?.content || "",
        },
        introVideo: data.introVideo || {},
      });
    }
  }, [data]);

  const cloneState = (prev) => JSON.parse(JSON.stringify(prev));

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...cloneState(prev), [field]: value }));
  };

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => {
      const cloned = cloneState(prev);
      cloned[section][field] = value;
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
        const response = await uploadIntroVideo({
          moduleId: id,
          body: fd,
        }).unwrap();
        setFormData((prev) => ({
          ...cloneState(prev),
          introVideo: response.introVideo,
        }));
        alert("Intro video uploaded!");
      } catch (err) {
        console.error("Video upload error:", err);
        toast.error("Failed to update module");
      } finally {
        setIsSubmitting(false);
      }
    };
    fileInput.click();
  };

  // Skriv inn læringsmåls
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
      cloned.learningObjectives.push({
        text: "",
        order: cloned.learningObjectives.length + 1,
      });
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
        toast.error("Failed to update module");
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

  // Aktivitetsverktøy (for build-your-own)
  const handleActivityChange = (taskIndex, actIndex, field, value) => {
    setFormData((prev) => {
      const cloned = cloneState(prev);
      cloned.interactiveTasks[taskIndex].config.activityToolbox[actIndex][
        field
      ] = value;
      return cloned;
    });
  };

  const addActivity = (taskIndex) => {
    setFormData((prev) => {
      const cloned = cloneState(prev);
      const activities =
        cloned.interactiveTasks[taskIndex].config.activityToolbox || [];
      const newId = `activity${activities.length + 1}`;
      activities.push({
        id: newId,
        name: "",
        icon: "",
        min: 0,
        max: 10,
        recommended: 1,
        description: "",
      });
      cloned.interactiveTasks[taskIndex].config.activityToolbox = activities;
      return cloned;
    });
  };

  const removeActivity = (taskIndex, actIndex) => {
    setFormData((prev) => {
      const cloned = cloneState(prev);
      cloned.interactiveTasks[taskIndex].config.activityToolbox.splice(
        actIndex,
        1,
      );
      return cloned;
    });
  };

  // Balansetips (for build-your-own)
  const handleBalanceTipChange = (taskIndex, tipIndex, field, value) => {
    setFormData((prev) => {
      const cloned = cloneState(prev);
      cloned.interactiveTasks[taskIndex].config.balanceTips[tipIndex][field] =
        value;
      return cloned;
    });
  };

  const addBalanceTip = (taskIndex) => {
    setFormData((prev) => {
      const cloned = cloneState(prev);
      const tips = cloned.interactiveTasks[taskIndex].config.balanceTips || [];
      tips.push({ activity: "", status: "balanced", message: "", badge: "" });
      cloned.interactiveTasks[taskIndex].config.balanceTips = tips;
      return cloned;
    });
  };

  const removeBalanceTip = (taskIndex, tipIndex) => {
    setFormData((prev) => {
      const cloned = cloneState(prev);
      cloned.interactiveTasks[taskIndex].config.balanceTips.splice(tipIndex, 1);
      return cloned;
    });
  };

  // Merker (for build-your-own)
  const handleBadgeChange = (taskIndex, badgeIndex, field, value) => {
    setFormData((prev) => {
      const cloned = cloneState(prev);
      cloned.interactiveTasks[taskIndex].config.badges[badgeIndex][field] =
        value;
      return cloned;
    });
  };

  const addBadge = (taskIndex) => {
    setFormData((prev) => {
      const cloned = cloneState(prev);
      const badges = cloned.interactiveTasks[taskIndex].config.badges || [];
      const newId = `badge${badges.length + 1}`;
      badges.push({ id: newId, name: "", icon: "", requirement: "" });
      cloned.interactiveTasks[taskIndex].config.badges = badges;
      return cloned;
    });
  };

  const removeBadge = (taskIndex, badgeIndex) => {
    setFormData((prev) => {
      const cloned = cloneState(prev);
      cloned.interactiveTasks[taskIndex].config.badges.splice(badgeIndex, 1);
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

  const handleQuizOptionChange = (qIndex, optIndex, field, value) => {
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

  const addQuizOption = (qIndex) => {
    setFormData((prev) => {
      const cloned = cloneState(prev);
      const options = cloned.quiz.questions[qIndex].options;
      const newId = String.fromCharCode(65 + options.length);
      options.push({ id: newId, text: "", isCorrect: false });
      return cloned;
    });
  };

  const removeQuizOption = (qIndex, optIndex) => {
    setFormData((prev) => {
      const cloned = cloneState(prev);
      cloned.quiz.questions[qIndex].options.splice(optIndex, 1);
      return cloned;
    });
  };

  // Format data for API
  const formatDataForUpdate = () => {
    const objectives = formData.learningObjectives.map((obj) => obj.text);

    const contentBlocks = formData.learningContent.map((block) => {
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
      if (block.image?.url) {
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

      if (task.type === "build-your-own" && task.config) {
        base.config = {
          activityToolbox: (task.config.activityToolbox || []).map((act) => ({
            id: act.id,
            name: act.name,
            icon: act.icon,
            min: act.min,
            max: act.max,
            recommended: act.recommended,
            description: act.description,
          })),
          balanceTips: (task.config.balanceTips || []).map((tip) => ({
            activity: tip.activity,
            status: tip.status,
            message: tip.message,
            badge: tip.badge || null,
          })),
          badges: (task.config.badges || []).map((badge) => ({
            id: badge.id,
            name: badge.name,
            icon: badge.icon,
            requirement: badge.requirement,
          })),
        };
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
      contentBlocks,
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
      toast.success("Module updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update module");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (isError)
    return <div className="p-6 text-red-500">Error: {error?.message}</div>;

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Rediger modul: {formData.title}</h2>

      <form onSubmit={handleSubmit}>
        {/* Module Information */}
        <section className="mb-8 p-4 border rounded-lg">
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
              Tittel
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Tema
            </label>
            <input
              type="text"
              value={formData.theme}
              onChange={(e) => handleInputChange("theme", e.target.value)}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Beskrivelse
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows="3"
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </section>

        {/* Introduksjonsvideo */}
        <section className="mb-8 p-4 border rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Introduksjonsvideo</h3>
          {formData.introVideo?.url ? (
            <div className="mb-4">
              <video controls className="w-full max-w-md h-auto rounded border">
                <source src={formData.introVideo.url} type="video/mp4" />
              </video>
            </div>
          ) : (
            <p className="text-gray-500 italic mb-4">Ingen introduksjonsvideo lastet opp</p>
          )}
          <button
            type="button"
            onClick={handleIntroVideoUpload}
            disabled={isSubmitting}
            className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isSubmitting ? "Laster opp..." : "Last opp/bytt introduksjonsvideo"}
          </button>
        </section>

        {/* Learning Objectives */}
        <section className="mb-8 p-4 border rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Learning Objectives</h3>
            <button
              type="button"
              onClick={addObjective}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
            >
              Add
            </button>
          </div>
          {formData.learningObjectives.map((obj, index) => (
            <div key={index} className="mb-3 flex items-center gap-2">
              <span className="text-gray-500 font-medium">{index + 1}.</span>
              <input
                type="text"
                value={obj.text}
                onChange={(e) => handleObjectiveChange(index, e.target.value)}
                className="flex-1 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Skriv inn læringsmål"
              />
              <button
                type="button"
                onClick={() => removeObjective(index)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                X
              </button>
            </div>
          ))}
        </section>

        {/* Learning Content */}
        <section className="mb-8 p-4 border rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Learning Content</h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => addContentBlock("text")}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
              >
                Legg til tekst
              </button>
              <button
                type="button"
                onClick={() => addContentBlock("image")}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
              >
                Legg til bilde
              </button>
            </div>
          </div>
          {formData.learningContent.map((block, index) => (
            <div key={index} className="mb-6 p-4 border rounded">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">
                  Blokk {index + 1} ({block.type})
                </h4>
                <button
                  type="button"
                  onClick={() => removeContentBlock(index)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Remove
                </button>
              </div>
              {block.type === "image" && (
                <div className="mb-4">
                  <div className="flex items-center gap-4 mb-3">
                    {block.image?.url ? (
                      <img
                        src={block.image.url}
                        alt="Content"
                        className="w-32 h-32 object-cover border rounded"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-gray-200 border rounded flex items-center justify-center text-gray-500 text-sm">
                        Ingen bilde
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleContentImageUpload(index)}
                      disabled={isSubmitting}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      {block.image?.url ? "Bytt bilde" : "Last opp bilde"}
                    </button>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Innholdstekst
                    </label>
                    <textarea
                      value={
                        typeof block.content === "string" ? block.content : ""
                      }
                      onChange={(e) =>
                        handleContentTextChange(index, e.target.value)
                      }
                      rows="3"
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
              {block.type === "text" && (
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Innholdstekst
                  </label>
                  <textarea
                    value={
                      typeof block.content === "object"
                        ? block.content.text
                        : block.content
                    }
                    onChange={(e) =>
                      handleContentTextChange(index, e.target.value)
                    }
                    rows="3"
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          ))}
        </section>

        {/* Interactive Tasks */}
        <section className="mb-8 p-4 border rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Interactive Tasks</h3>
          {formData.interactiveTasks.map((task, taskIndex) => (
            <div key={taskIndex} className="mb-6 p-4 border rounded bg-gray-50">
              <h4 className="font-semibold text-lg mb-4">
                Oppgave {taskIndex + 1}: {task.title} ({task.type})
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Tittel
                  </label>
                  <input
                    type="text"
                    value={task.title || ""}
                    onChange={(e) =>
                      handleTaskChange(taskIndex, "title", e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Poeng
                  </label>
                  <input
                    type="number"
                    value={task.points || 0}
                    onChange={(e) =>
                      handleTaskChange(
                        taskIndex,
                        "points",
                        parseFloat(e.target.value),
                      )
                    }
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Beskrivelse
                </label>
                <textarea
                  value={task.description || ""}
                  onChange={(e) =>
                    handleTaskChange(taskIndex, "description", e.target.value)
                  }
                  rows="2"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Instruksjoner
                </label>
                <textarea
                  value={task.instructions || ""}
                  onChange={(e) =>
                    handleTaskChange(taskIndex, "instructions", e.target.value)
                  }
                  rows="2"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              {/* build-your-own specific config */}
              {task.type === "build-your-own" && task.config && (
                <>
                  {/* Aktivitetsverktøy */}
                  <div className="mb-6 p-3 border rounded bg-white">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="font-medium">Aktivitetsverktøy</h5>
                      <button
                        type="button"
                        onClick={() => addActivity(taskIndex)}
                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
                      >
                        Legg til aktivitet
                      </button>
                    </div>
                    {task.config.activityToolbox?.map((activity, actIndex) => (
                      <div
                        key={actIndex}
                        className="mb-3 p-3 border rounded bg-gray-50"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-sm">
                            Activity: {activity.name || activity.id}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeActivity(taskIndex, actIndex)}
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                          >
                            X
                          </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
                          <input
                            type="text"
                            value={activity.id}
                            onChange={(e) =>
                              handleActivityChange(
                                taskIndex,
                                actIndex,
                                "id",
                                e.target.value,
                              )
                            }
                            placeholder="ID"
                            className="px-2 py-1 border rounded text-sm"
                          />
                          <input
                            type="text"
                            value={activity.name}
                            onChange={(e) =>
                              handleActivityChange(
                                taskIndex,
                                actIndex,
                                "name",
                                e.target.value,
                              )
                            }
                            placeholder="Name"
                            className="px-2 py-1 border rounded text-sm"
                          />
                          <input
                            type="text"
                            value={activity.icon}
                            onChange={(e) =>
                              handleActivityChange(
                                taskIndex,
                                actIndex,
                                "icon",
                                e.target.value,
                              )
                            }
                            placeholder="Icon"
                            className="px-2 py-1 border rounded text-sm text-center"
                          />
                          <input
                            type="text"
                            value={activity.description}
                            onChange={(e) =>
                              handleActivityChange(
                                taskIndex,
                                actIndex,
                                "description",
                                e.target.value,
                              )
                            }
                            placeholder="Beskrivelse"
                            className="px-2 py-1 border rounded text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="text-xs text-gray-600">Min</label>
                            <input
                              type="number"
                              value={activity.min}
                              onChange={(e) =>
                                handleActivityChange(
                                  taskIndex,
                                  actIndex,
                                  "min",
                                  parseInt(e.target.value),
                                )
                              }
                              className="w-full px-2 py-1 border rounded text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-600">Maks</label>
                            <input
                              type="number"
                              value={activity.max}
                              onChange={(e) =>
                                handleActivityChange(
                                  taskIndex,
                                  actIndex,
                                  "max",
                                  parseInt(e.target.value),
                                )
                              }
                              className="w-full px-2 py-1 border rounded text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-600">
                              Recommended
                            </label>
                            <input
                              type="number"
                              value={activity.recommended}
                              onChange={(e) =>
                                handleActivityChange(
                                  taskIndex,
                                  actIndex,
                                  "recommended",
                                  parseInt(e.target.value),
                                )
                              }
                              className="w-full px-2 py-1 border rounded text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Balansetips */}
                  <div className="mb-6 p-3 border rounded bg-white">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="font-medium">Balansetips</h5>
                      <button
                        type="button"
                        onClick={() => addBalanceTip(taskIndex)}
                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
                      >
                        Legg til tips
                      </button>
                    </div>
                    {task.config.balanceTips?.map((tip, tipIndex) => (
                      <div
                        key={tipIndex}
                        className="mb-2 p-2 border rounded flex items-center gap-2 flex-wrap"
                      >
                        <input
                          type="text"
                          value={tip.activity}
                          onChange={(e) =>
                            handleBalanceTipChange(
                              taskIndex,
                              tipIndex,
                              "activity",
                              e.target.value,
                            )
                          }
                          placeholder="Aktivitets-ID"
                          className="w-24 px-2 py-1 border rounded text-sm"
                        />
                        <select
                          value={tip.status}
                          onChange={(e) =>
                            handleBalanceTipChange(
                              taskIndex,
                              tipIndex,
                              "status",
                              e.target.value,
                            )
                          }
                          className="px-2 py-1 border rounded text-sm"
                        >
                          <option value="missing">Missing</option>
                          <option value="under">Under</option>
                          <option value="balanced">Balanced</option>
                          <option value="excessive">Excessive</option>
                        </select>
                        <input
                          type="text"
                          value={tip.message}
                          onChange={(e) =>
                            handleBalanceTipChange(
                              taskIndex,
                              tipIndex,
                              "message",
                              e.target.value,
                            )
                          }
                          placeholder="Message"
                          className="flex-1 min-w-[200px] px-2 py-1 border rounded text-sm"
                        />
                        <input
                          type="text"
                          value={tip.badge || ""}
                          onChange={(e) =>
                            handleBalanceTipChange(
                              taskIndex,
                              tipIndex,
                              "badge",
                              e.target.value,
                            )
                          }
                          placeholder="Merke (valgfritt)"
                          className="w-32 px-2 py-1 border rounded text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeBalanceTip(taskIndex, tipIndex)}
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Merker */}
                  <div className="p-3 border rounded bg-white">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="font-medium">Merker</h5>
                      <button
                        type="button"
                        onClick={() => addBadge(taskIndex)}
                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
                      >
                        Legg til merke
                      </button>
                    </div>
                    {task.config.badges?.map((badge, badgeIndex) => (
                      <div
                        key={badgeIndex}
                        className="mb-2 p-2 border rounded flex items-center gap-2"
                      >
                        <input
                          type="text"
                          value={badge.id}
                          onChange={(e) =>
                            handleBadgeChange(
                              taskIndex,
                              badgeIndex,
                              "id",
                              e.target.value,
                            )
                          }
                          placeholder="ID"
                          className="w-28 px-2 py-1 border rounded text-sm"
                        />
                        <input
                          type="text"
                          value={badge.name}
                          onChange={(e) =>
                            handleBadgeChange(
                              taskIndex,
                              badgeIndex,
                              "name",
                              e.target.value,
                            )
                          }
                          placeholder="Name"
                          className="w-32 px-2 py-1 border rounded text-sm"
                        />
                        <input
                          type="text"
                          value={badge.icon}
                          onChange={(e) =>
                            handleBadgeChange(
                              taskIndex,
                              badgeIndex,
                              "icon",
                              e.target.value,
                            )
                          }
                          placeholder="Icon"
                          className="w-16 px-2 py-1 border rounded text-sm text-center"
                        />
                        <input
                          type="text"
                          value={badge.requirement}
                          onChange={(e) =>
                            handleBadgeChange(
                              taskIndex,
                              badgeIndex,
                              "requirement",
                              e.target.value,
                            )
                          }
                          placeholder="Requirement"
                          className="flex-1 px-2 py-1 border rounded text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeBadge(taskIndex, badgeIndex)}
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </section>

        {/* Quiz */}
        <section className="mb-8 p-4 border rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Quiz</h3>
            <button
              type="button"
              onClick={addQuestion}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
            >
              Legg til spørsmål
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Quiz-tittel
              </label>
              <input
                type="text"
                value={formData.quiz.title}
                onChange={(e) =>
                  handleNestedChange("quiz", "title", e.target.value)
                }
                className="w-full px-3 py-2 border rounded"
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
                    parseInt(e.target.value),
                  )
                }
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Beskrivelse
            </label>
            <textarea
              value={formData.quiz.description}
              onChange={(e) =>
                handleNestedChange("quiz", "description", e.target.value)
              }
              rows="2"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="flex gap-4 mb-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.quiz.allowRetake}
                onChange={(e) =>
                  handleNestedChange("quiz", "allowRetake", e.target.checked)
                }
              />
              Allow Retake
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.quiz.showCorrectAnswers}
                onChange={(e) =>
                  handleNestedChange(
                    "quiz",
                    "showCorrectAnswers",
                    e.target.checked,
                  )
                }
              />
              Vis riktige svar
            </label>
          </div>

          {formData.quiz.questions.map((q, qIndex) => (
            <div key={qIndex} className="mb-6 p-4 border rounded bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">Spørsmål {q.questionNumber}</h4>
                <button
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
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
                  <input
                    type="text"
                    value="multiple-choice"
                    readOnly
                    className="w-full px-3 py-2 border rounded bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Poeng
                  </label>
                  <input
                    type="number"
                    value={q.points}
                    onChange={(e) =>
                      handleQuestionChange(
                        qIndex,
                        "points",
                        parseFloat(e.target.value),
                      )
                    }
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Spørsmålstekst
                </label>
                <textarea
                  value={q.question}
                  onChange={(e) =>
                    handleQuestionChange(qIndex, "question", e.target.value)
                  }
                  rows="2"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Forklaring
                </label>
                <textarea
                  value={q.explanation || ""}
                  onChange={(e) =>
                    handleQuestionChange(qIndex, "explanation", e.target.value)
                  }
                  rows="2"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-gray-700 text-sm font-bold">
                    Alternativer (velg ett som riktig)
                  </label>
                  <button
                    type="button"
                    onClick={() => addQuizOption(qIndex)}
                    className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
                  >
                    Legg til alternativ
                  </button>
                </div>
                {q.options.map((opt, optIndex) => (
                  <div
                    key={optIndex}
                    className="mb-2 p-2 border rounded flex items-center gap-2 bg-white"
                  >
                    <span className="font-medium w-8">{opt.id}.</span>
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) =>
                        handleQuizOptionChange(
                          qIndex,
                          optIndex,
                          "text",
                          e.target.value,
                        )
                      }
                      className="flex-1 px-2 py-1 border rounded"
                      placeholder="Option text"
                    />
                    <label className="flex items-center gap-1 text-sm">
                      <input
                        type="radio"
                        name={`quiz-correct-${qIndex}`}
                        checked={opt.isCorrect}
                        onChange={() =>
                          handleQuizOptionChange(
                            qIndex,
                            optIndex,
                            "isCorrect",
                            true,
                          )
                        }
                      />
                      Correct
                    </label>
                    <button
                      type="button"
                      onClick={() => removeQuizOption(qIndex, optIndex)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Foreldretips */}
        <section className="mb-8 p-4 border rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Foreldretips</h3>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Tittel
            </label>
            <input
              type="text"
              value={formData.parentTip.title}
              onChange={(e) =>
                handleNestedChange("parentTip", "title", e.target.value)
              }
              className="w-full px-3 py-2 border rounded"
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
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </section>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isSubmitting ? "Updating..." : "Update Module"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Eightmodules;
