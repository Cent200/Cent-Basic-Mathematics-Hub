import { useState, useEffect } from "react";
import { Play, FileText, Lock, CheckCircle2, ArrowLeft, ArrowRight, X, Copy, Plus, Settings } from "lucide-react";

const BANK = {
  accountName: "Innocent Anawo Odoh",
  accountNumber: "0065678076",
  bankName: "Stanbic IBTC Bank",
};

const DEFAULT_COURSE = {
  title: "Your First Course",
  tagline: "Add a real title and description from the creator panel — this is placeholder text.",
  price: 5000,
};

const DEFAULT_LESSONS = [
  { id: 1, title: "Welcome — start here", type: "text", content: "This is your first lesson. Edit or replace it from the creator panel once you're ready.", free: true },
];

function LessonIcon({ type, locked }) {
  if (locked) return <Lock size={15} strokeWidth={2} />;
  return type === "video" ? <Play size={15} strokeWidth={2} /> : <FileText size={15} strokeWidth={2} />;
}

function useCourseData() {
  const [course, setCourse] = useState(DEFAULT_COURSE);
  const [lessons, setLessons] = useState(DEFAULT_LESSONS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const c = localStorage.getItem("course-info");
      if (c) setCourse(JSON.parse(c));
    } catch (e) {}
    try {
      const l = localStorage.getItem("course-lessons");
      if (l) setLessons(JSON.parse(l));
    } catch (e) {}
    setLoaded(true);
  }, []);

  const saveCourse = (next) => {
    setCourse(next);
    try { localStorage.setItem("course-info", JSON.stringify(next)); } catch (e) {}
  };
  const saveLessons = (next) => {
    setLessons(next);
    try { localStorage.setItem("course-lessons", JSON.stringify(next)); } catch (e) {}
  };

  return { course, lessons, loaded, saveCourse, saveLessons };
}

function usePurchased() {
  const [purchased, setPurchased] = useState(false);
  useEffect(() => {
    try {
      if (localStorage.getItem("purchased") === "true") setPurchased(true);
    } catch (e) {}
  }, []);
  const markPurchased = () => {
    setPurchased(true);
    try { localStorage.setItem("purchased", "true"); } catch (e) {}
  };
  return { purchased, markPurchased };
}

function Header({ onCreatorClick }) {
  return (
    <div className="max-w-5xl mx-auto px-6 pt-8 flex items-center justify-between">
      <div className="font-mono text-xs tracking-widest uppercase text-[#C9922B]">Cent Basic Mathematics Hub</div>
      <button onClick={onCreatorClick} className="flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-[#22303C] transition-colors">
        <Settings size={13} /> Creator panel
      </button>
    </div>
  );
}

function Catalog({ course, lessons, onOpenCourse, onCreatorClick }) {
  return (
    <div className="min-h-screen bg-[#EDEAE3] text-[#22303C]">
      <Header onCreatorClick={onCreatorClick} />
      <header className="max-w-5xl mx-auto px-6 pt-10 pb-10">
        <h1 className="font-serif text-5xl sm:text-6xl leading-[1.05] tracking-tight mb-5" style={{ fontFamily: "Fraunces, serif" }}>
          Learn something<br />worth learning.
        </h1>
        <p className="text-[#4B5563] text-lg max-w-md leading-relaxed">
          Text and video lessons, taught properly, at your own pace.
        </p>
      </header>

      <main className="max-w-5xl mx-auto px-6 pb-24">
        <div
          onClick={onOpenCourse}
          className="group cursor-pointer bg-[#F7F5F0] border border-[#D8D3C8] rounded-sm overflow-hidden hover:border-[#22303C] transition-colors"
        >
          <div className="grid sm:grid-cols-[1.1fr,1fr]">
            <div className="p-8 sm:p-10 flex flex-col justify-between">
              <div>
                <div className="font-mono text-[11px] tracking-widest uppercase text-[#6B7280] mb-3">
                  {lessons.length} lesson{lessons.length === 1 ? "" : "s"} · text &amp; video
                </div>
                <h2 className="font-serif text-3xl mb-3" style={{ fontFamily: "Fraunces, serif" }}>{course.title}</h2>
                <p className="text-[#4B5563] leading-relaxed mb-6">{course.tagline}</p>
              </div>
              <div className="flex items-center justify-between border-t border-[#D8D3C8] pt-5">
                <div className="text-sm text-[#6B7280]">Cent Basic Mathematics Hub</div>
                <div className="flex items-center gap-2 font-serif text-2xl" style={{ fontFamily: "Fraunces, serif" }}>
                  ₦{Number(course.price).toLocaleString()}
                  <ArrowRight size={18} className="opacity-40 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
                </div>
              </div>
            </div>
            <div className="bg-[#22303C] p-8 sm:p-10 text-[#EDEAE3] flex flex-col justify-center gap-3">
              {lessons.slice(0, 5).map((l) => (
                <div key={l.id} className="flex items-center gap-3 text-sm">
                  <span className="font-mono text-[#C9922B] w-5">{String(l.id).padStart(2, "0")}</span>
                  <LessonIcon type={l.type} locked={!l.free} />
                  <span className={l.free ? "" : "text-[#9CA3AF]"}>{l.title}</span>
                </div>
              ))}
              {lessons.length > 5 && (
                <div className="text-xs text-[#9CA3AF] font-mono pl-8 pt-1">+ {lessons.length - 5} more</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function CourseDetail({ course, lessons, purchased, onBuy, onBack, onOpenLesson }) {
  return (
    <div className="min-h-screen bg-[#EDEAE3] text-[#22303C]">
      <div className="max-w-3xl mx-auto px-6 pt-10 pb-24">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#22303C] mb-8 transition-colors">
          <ArrowLeft size={15} /> All courses
        </button>

        <h1 className="font-serif text-4xl mb-3" style={{ fontFamily: "Fraunces, serif" }}>{course.title}</h1>
        <p className="text-[#4B5563] text-lg leading-relaxed mb-8 max-w-xl">{course.tagline}</p>

        {!purchased && (
          <div className="flex items-center justify-between bg-[#F7F5F0] border border-[#D8D3C8] rounded-sm px-6 py-5 mb-10">
            <div>
              <div className="font-serif text-3xl" style={{ fontFamily: "Fraunces, serif" }}>₦{Number(course.price).toLocaleString()}</div>
              <div className="text-xs text-[#6B7280] mt-1">One-time payment · lifetime access</div>
            </div>
            <button onClick={onBuy} className="bg-[#22303C] text-[#EDEAE3] px-6 py-3 rounded-sm text-sm tracking-wide hover:bg-[#1A252E] transition-colors">
              Enroll now
            </button>
          </div>
        )}
        {purchased && (
          <div className="flex items-center gap-2 text-sm text-[#2F6E62] bg-[#2F6E62]/10 border border-[#2F6E62]/30 rounded-sm px-4 py-3 mb-10">
            <CheckCircle2 size={16} /> You own this course — everything below is unlocked.
          </div>
        )}

        <div className="font-mono text-xs tracking-widest uppercase text-[#6B7280] mb-4">Syllabus</div>
        <div className="border-t border-[#D8D3C8]">
          {lessons.map((l) => {
            const locked = !purchased && !l.free;
            return (
              <button
                key={l.id}
                disabled={locked}
                onClick={() => onOpenLesson(l)}
                className={`w-full flex items-center gap-4 py-4 border-b border-[#D8D3C8] text-left transition-colors ${
                  locked ? "opacity-45 cursor-not-allowed" : "hover:bg-[#F7F5F0] cursor-pointer"
                }`}
              >
                <span className="font-mono text-sm text-[#C9922B] w-6">{String(l.id).padStart(2, "0")}</span>
                <LessonIcon type={l.type} locked={locked} />
                <span className="flex-1">{l.title}</span>
                {l.free && !purchased && (
                  <span className="font-mono text-[10px] tracking-widest uppercase text-[#2F6E62]">Preview</span>
                )}
              </button>
            );
          })}
          {lessons.length === 0 && (
            <div className="py-10 text-center text-sm text-[#6B7280]">
              No lessons yet — add your first one from the creator panel.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LessonView({ lesson, onBack }) {
  const isEmbeddable = lesson.content && (lesson.content.includes("youtube.com") || lesson.content.includes("youtu.be") || lesson.content.includes("vimeo.com"));
  const embedUrl = lesson.content?.includes("youtu.be")
    ? lesson.content.replace("youtu.be/", "www.youtube.com/embed/")
    : lesson.content?.includes("watch?v=")
    ? lesson.content.replace("watch?v=", "embed/")
    : lesson.content;

  return (
    <div className="min-h-screen bg-[#EDEAE3] text-[#22303C]">
      <div className="max-w-2xl mx-auto px-6 pt-10 pb-24">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#22303C] mb-8 transition-colors">
          <ArrowLeft size={15} /> Back to syllabus
        </button>
        <h1 className="font-serif text-3xl mb-6" style={{ fontFamily: "Fraunces, serif" }}>{lesson.title}</h1>

        {lesson.type === "video" ? (
          lesson.content && isEmbeddable ? (
            <div className="aspect-video rounded-sm overflow-hidden mb-6">
              <iframe className="w-full h-full" src={embedUrl} title={lesson.title} allowFullScreen />
            </div>
          ) : lesson.content ? (
            <video controls className="w-full rounded-sm mb-6" src={lesson.content} />
          ) : (
            <div className="aspect-video bg-[#22303C] rounded-sm flex items-center justify-center mb-6 text-[#9CA3AF] text-xs font-mono">
              no video link added yet
            </div>
          )
        ) : (
          <div className="bg-[#F7F5F0] border border-[#D8D3C8] rounded-sm p-8 mb-6 leading-relaxed text-[#374151] whitespace-pre-wrap">
            {lesson.content || "No content added yet."}
          </div>
        )}
      </div>
    </div>
  );
}
