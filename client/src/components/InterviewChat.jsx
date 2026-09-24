import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, RotateCcw, Send } from 'lucide-react';
import ProgressStepper from './ProgressStepper';

export default function InterviewChat({
  messages,
  currentQuestion,
  isLoading,
  isCompiling,
  onSendMessage,
  onCompileBrandKit,
  onReset
}) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentQuestion, isLoading, isCompiling]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!inputText.trim() || isLoading || isCompiling) return;
    const textToSend = inputText.trim();
    setInputText('');
    onSendMessage(textToSend);
  };

  const handlePillClick = (pillText) => {
    if (isLoading || isCompiling) return;
    onSendMessage(pillText);
  };

  const currentRound = currentQuestion?.currentRound || 1;
  const isComplete = currentQuestion?.isComplete || false;

  return (
    <div className="w-full max-w-[840px] mx-auto px-4 py-4 flex flex-col min-h-[calc(100vh-8rem)] animate-fade-in">
      {/* Editorial Stepper */}
      <ProgressStepper currentRound={currentRound} isComplete={isComplete} />

      {/* Main Dialogue Card Container */}
      <div className="flex-1 bg-white rounded-[28px] border border-[#dbd7cd] flex flex-col overflow-hidden">
        {/* Dialogue Top Header */}
        <div className="px-6 py-4 border-b border-[#dbd7cd] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-black" />
            <span className="text-xs uppercase tracking-[0.05em] text-[#737373]">
              Brand Strategist &bull; Step {currentRound} of 3
            </span>
          </div>

          <button
            onClick={onReset}
            className="text-xs text-[#737373] hover:text-black transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-transparent hover:border-[#dbd7cd]"
            title="Start Over"
          >
            <RotateCcw className="w-3.5 h-3.5 stroke-[1.5]" />
            <span>Reset</span>
          </button>
        </div>

        {/* Message History Feed */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id || index}
                className={`flex flex-col animate-slide-up ${isUser ? 'items-end' : 'items-start'}`}
              >
                {isUser ? (
                  /* Founder Answer Pill */
                  <div className="max-w-[85%] sm:max-w-[70%] bg-[#f2f1ed] text-black border border-[#dbd7cd] rounded-2xl sm:rounded-full px-5 py-3 text-sm leading-relaxed">
                    <p>{msg.content}</p>
                  </div>
                ) : (
                  /* Strategist Socratic Card */
                  <div className="w-full bg-[#f2f1ed]/40 border border-[#dbd7cd] rounded-2xl sm:rounded-3xl p-6 sm:p-7 space-y-4">
                    <span className="text-[11px] uppercase tracking-[0.08em] text-[#737373] block">
                      Strategic Interrogation
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl text-black font-light leading-[1.1] tracking-[-0.03em]">
                      {msg.content}
                    </h3>

                    {msg.reasoning && (
                      <div className="pt-3 border-t border-[#dbd7cd] flex items-baseline gap-2">
                        <span className="text-[11px] uppercase tracking-[0.05em] text-[#737373] shrink-0">
                          Strategy Note:
                        </span>
                        <p className="text-xs text-[#737373] leading-relaxed">
                          {msg.reasoning}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && !isCompiling && (
            <div className="p-6 rounded-2xl bg-[#f2f1ed]/50 border border-[#dbd7cd] flex items-center gap-3 text-xs text-[#737373] animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
              <span>Analyzing market trade-offs & formulating next question...</span>
            </div>
          )}

          {/* Synthesis Loader */}
          {isCompiling && (
            <div className="bg-[#f2f1ed]/70 border border-black rounded-3xl p-8 text-center space-y-3 animate-fade-in">
              <span className="text-xs uppercase tracking-[0.08em] text-[#737373] block">Synthesis in progress</span>
              <h3 className="font-serif text-3xl font-light text-black tracking-[-0.03em] leading-tight">
                Authoring your Brand Monograph...
              </h3>
              <p className="text-xs text-[#737373] max-w-md mx-auto leading-relaxed">
                Compiling typographic scales, contrasting color tokens, voice dos & don'ts, and the launch manifesto.
              </p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Interactive Area */}
        <div className="p-4 sm:p-6 border-t border-[#dbd7cd] bg-white space-y-4">
          {/* Completion State Banner */}
          {isComplete && !isCompiling && (
            <div className="p-6 rounded-2xl bg-[#f2f1ed] border border-black flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-slide-up">
              <div>
                <span className="text-[11px] uppercase tracking-[0.08em] text-[#737373] block mb-1">
                  Dialogue Complete
                </span>
                <h4 className="font-serif text-2xl text-black font-light tracking-[-0.03em]">
                  Ready to compile your brand monograph.
                </h4>
              </div>

              <button
                type="button"
                onClick={onCompileBrandKit}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-black text-white hover:bg-neutral-800 text-sm font-normal transition-all flex items-center justify-center gap-2"
              >
                <span>Synthesize Brand Kit</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[1.5]" />
              </button>
            </div>
          )}

          {/* Quick-Reply Suggested Paths (3 Columns) */}
          {!isComplete && currentQuestion?.suggestedAnswers?.length > 0 && !isLoading && (
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-[0.05em] text-[#737373] block">
                Suggested paths:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                {currentQuestion.suggestedAnswers.map((answer, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePillClick(answer)}
                    disabled={isLoading}
                    className="text-left text-xs sm:text-sm p-3.5 rounded-2xl border border-[#dbd7cd] bg-white hover:bg-[#f2f1ed] hover:border-black text-black transition-all flex items-start gap-2.5 h-auto whitespace-normal break-words leading-snug group"
                  >
                    <span className="text-[11px] font-mono text-[#999999] group-hover:text-black mt-0.5 shrink-0">
                      {idx + 1}
                    </span>
                    <span className="flex-1">{answer}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Response Input Bar */}
          {!isComplete && (
            <form onSubmit={handleSubmit} className="flex items-center gap-2 rounded-full border border-[#dbd7cd] bg-white p-1.5 focus-within:border-black transition-colors">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Or type your own answer directly..."
                disabled={isLoading || isCompiling}
                className="flex-1 px-4 py-2 bg-transparent text-black placeholder-[#999999] text-xs sm:text-sm focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading || isCompiling}
                className="w-8 h-8 rounded-full bg-black text-white hover:bg-neutral-800 disabled:bg-[#dbd7cd] disabled:text-[#999999] flex items-center justify-center shrink-0 transition-colors"
                title="Send answer"
              >
                <Send className="w-3.5 h-3.5 stroke-[1.5]" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
