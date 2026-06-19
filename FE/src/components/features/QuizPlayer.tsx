import { useState } from 'react';
import api from '@/lib/api';
import Button from '@/components/ui/Button';
import { toast } from '@/components/ui/Toast';

interface QuizPlayerProps {
  lesson: any;
  enrollmentId: string;
  onCompleted: () => void;
}

export default function QuizPlayer({ lesson, enrollmentId, onCompleted }: QuizPlayerProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const questions = lesson.quizQuestions || [];

  const handleSelect = (questionId: string, choiceId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: choiceId }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      toast('warning', 'Vui lòng trả lời tất cả các câu hỏi');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await api.post(`/learn/quiz/${lesson.id}/submit`, { answers });
      setResult(data.data);
      if (data.data.isPassed) {
        toast('success', 'Chúc mừng bạn đã vượt qua bài kiểm tra!');
        onCompleted();
      } else {
        toast('error', `Bạn chỉ đạt ${data.data.score}%. Vui lòng thử lại.`);
      }
    } catch (error: any) {
      toast('error', error.response?.data?.message || 'Có lỗi xảy ra khi nộp bài');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setResult(null);
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[var(--bg-secondary)]">
        <div className="text-4xl mb-4">📝</div>
        <h2 className="text-xl font-bold mb-2">Bài kiểm tra chưa có câu hỏi</h2>
        <p className="text-[var(--text-muted)] text-center">Giảng viên đang cập nhật nội dung bài kiểm tra này.</p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[var(--bg-secondary)]">
        <div className="glass-card p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">{result.isPassed ? '🏆' : '💔'}</div>
          <h2 className="text-2xl font-bold mb-2">{result.isPassed ? 'Đạt yêu cầu!' : 'Chưa đạt!'}</h2>
          <p className="text-[var(--text-muted)] mb-6">
            Điểm của bạn: <span className={`font-bold text-lg ${result.isPassed ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>{result.score}%</span>
            <br />
            (Điểm qua môn: 80%)
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button variant={result.isPassed ? 'secondary' : 'primary'} onClick={handleRetry}>
              Làm lại bài
            </Button>
            {result.isPassed && (
              <Button onClick={onCompleted}>Tiếp tục học</Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto custom-scrollbar bg-[var(--bg-secondary)] p-8">
      <div className="max-w-3xl mx-auto w-full">
        <div className="mb-8 border-b border-[var(--border)] pb-6">
          <h2 className="text-2xl font-bold mb-2">Trắc nghiệm: {lesson.title}</h2>
          <p className="text-[var(--text-muted)]">Hãy trả lời {questions.length} câu hỏi dưới đây để hoàn thành bài học.</p>
        </div>

        <div className="space-y-8 mb-10">
          {questions.map((q: any, index: number) => (
            <div key={q.id} className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4">
                <span className="text-[var(--primary)] mr-2">Câu {index + 1}:</span>
                {q.questionText}
              </h3>
              <div className="space-y-3">
                {q.choices.map((choice: any) => (
                  <label 
                    key={choice.id} 
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      answers[q.id] === choice.id 
                        ? 'border-[var(--primary)] bg-[var(--primary)]/10' 
                        : 'border-[var(--border)] hover:bg-[var(--bg-tertiary)]'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question_${q.id}`}
                      value={choice.id}
                      checked={answers[q.id] === choice.id}
                      onChange={() => handleSelect(q.id, choice.id)}
                      className="w-4 h-4 text-[var(--primary)] bg-[var(--bg-tertiary)] border-gray-300 focus:ring-[var(--primary)] focus:ring-2"
                    />
                    <span className="ml-3 text-sm font-medium">{choice.choiceText}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end sticky bottom-4">
          <Button size="lg" onClick={handleSubmit} isLoading={isSubmitting}>
            Nộp bài kiểm tra
          </Button>
        </div>
      </div>
    </div>
  );
}
