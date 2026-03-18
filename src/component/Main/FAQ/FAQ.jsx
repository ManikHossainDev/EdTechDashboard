import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  useGetFaqQuery,
  useUpdateFaqMutation,
  useCreateFaqMutation,
  useDeleteFaqMutation,
} from "../../../redux/features/setting/settingApi";

const FAQ = () => {
  const { data: faqData, isLoading, isError } = useGetFaqQuery({});
  const [updateFaq] = useUpdateFaqMutation();
  const [createFaq] = useCreateFaqMutation();
  const [deleteFaq] = useDeleteFaqMutation();

  const [faqs, setFaqs] = useState([]);

  // Initialize faqs with data from API
  useEffect(() => {
    if (faqData) {
      setFaqs(faqData);
    }
  }, [faqData]);

  const updateFaqItem = (id, field, value) => {
    setFaqs(
      faqs.map((faq) => (faq._id === id ? { ...faq, [field]: value } : faq))
    );
  };

  const addNewFaq = () => {
    const newFaq = {
      _id: `new-${Date.now()}`, // Temporary ID for new items
      question: "",
      answer: "",
      category: "Generelt",
      order: faqs.length,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setFaqs([...faqs, newFaq]);
  };

  const removeFaq = async (id) => {
    if (id.startsWith && id.startsWith('new-')) {
      // If it's a new FAQ (not yet saved), just remove from the local state
      setFaqs(faqs.filter((faq) => faq._id !== id));
    } else {
      // If it's an existing FAQ, delete from the backend
      try {
        await deleteFaq(id);
        setFaqs(faqs.filter((faq) => faq._id !== id));
        alert("Vanlig spørsmål ble slettet!");
      } catch (error) {
        console.error("Error deleting FAQ:", error);
        alert("Feil ved sletting av vanlige spørsmål. Prøv igjen.");
      }
    }
  };

  const handleUpdate = async () => {
    try {
      // Process each FAQ item
      for (const faq of faqs) {
        if (faq._id.startsWith && faq._id.startsWith("new-")) {
          // This is a new FAQ item - create it
          const newFaq = {
            question: faq.question,
            answer: faq.answer,
            category: "Generelt",
            order: faqs.indexOf(faq),
            isActive: true,
          };

          await createFaq(newFaq);
        } else {
          // This is an existing FAQ item - update it
          const updateBody = {
            question: faq.question,
            answer: faq.answer,
          };

          await updateFaq({ faqId: faq._id, updateBody });
        }
      }
      alert("Vanlige spørsmål ble oppdatert!");
    } catch (error) {
      console.error("Error updating FAQs:", error);
      alert("Feil ved oppdatering av vanlige spørsmål. Prøv igjen.");
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Laster vanlige spørsmål...
      </div>
    );
  if (isError)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Feil ved lasting av vanlige spørsmål
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className=" bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Administrer vanlige spørsmål</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <div
              key={faq._id}
              className="space-y-3 p-4 border border-gray-200 rounded-lg relative"
            >
              <button
                onClick={() => removeFaq(faq._id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                title="Fjern spørsmål"
              >
                <Trash2 size={18} />
              </button>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Spørsmål {index + 1}
                </label>
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) =>
                    updateFaqItem(faq._id, "question", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none"
                  placeholder="Skriv inn spørsmål..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Svar
                </label>
                <textarea
                  value={faq.answer}
                  onChange={(e) =>
                    updateFaqItem(faq._id, "answer", e.target.value)
                  }
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none resize-none"
                  placeholder="Skriv inn svar..."
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center gap-4 mt-8">
          <button
            onClick={addNewFaq}
            className="flex items-center justify-center gap-2 bg-orange-400 hover:bg-orange-500 text-white rounded-lg px-4 py-2 shadow-md transition-colors"
          >
            <Plus size={18} />
            Legg til nytt spørsmål
          </button>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={handleUpdate}
            className="px-16 py-3 bg-orange-400 hover:bg-orange-500 text-white font-medium rounded-lg shadow-md transition-colors"
          >
            Oppdater alle spørsmål
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
