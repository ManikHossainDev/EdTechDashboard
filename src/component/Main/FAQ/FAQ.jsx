import { useState } from 'react';
import { Plus } from 'lucide-react';

const FAQ = () => {

  const [questions, setQuestions] = useState([
    { id: 1, question: '', answer: '' },
    { id: 2, question: '', answer: '' },
    { id: 3, question: '', answer: '' },
    { id: 4, question: '', answer: '' }
  ]);

  const addQuestion = () => {
    const newId = questions.length + 1;
    setQuestions([...questions, { id: newId, question: '', answer: '' }]);
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(
      questions.map(q =>
        q.id === id ? { ...q, [field]: value } : q
      )
    );
  };

  const handleUpdate = () => {
    console.log('Form data:', questions);
    alert('Form updated successfully!');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm p-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {questions.map((q, index) => (
            <div key={q.id} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question {index + 1}
                </label>
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) =>
                    updateQuestion(q.id, 'question', e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Answer
                </label>
                <textarea
                  value={q.answer}
                  onChange={(e) =>
                    updateQuestion(q.id, 'answer', e.target.value)
                  }
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none resize-none"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end items-center gap-4 mt-8">
          <button
            onClick={addQuestion}
            className="flex items-center justify-center w-12 h-12 bg-orange-400 hover:bg-orange-500 text-white rounded-full shadow-lg transition-colors"
          >
            <Plus size={24} />
          </button>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={handleUpdate}
            className="px-16 py-3 bg-orange-400 hover:bg-orange-500 text-white font-medium rounded-lg shadow-md transition-colors"
          >
            Update
          </button>
        </div>

      </div>
    </div>
  );
};

export default FAQ;
