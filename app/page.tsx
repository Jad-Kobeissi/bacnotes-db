"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useInView } from "react-intersection-observer";
function Nav() {
  const router = useRouter();
  return (
    <nav className="flex justify-between fixed top-0 left-0 w-screen items-center px-3 py-1">
      <h1 className="text-[1.2rem] font-semibold">BACConnect</h1>
      <div className="flex gap-3">
        <button
          onClick={() => router.push(`/login`)}
          className="border border-(--border-color) text-[#1c1b2a] rounded-md py-1 px-4 font-medium"
        >
          LogIn
        </button>
        <button
          onClick={() => router.push(`/signup`)}
          className="bg-[#1C1B2A] text-white rounded-md py-1 px-4 font-medium"
        >
          SignUp
        </button>
      </div>
    </nav>
  );
}
function Home() {
  const router = useRouter();
  return (
    <div className="text-center my-30 flex flex-col gap-20 px-2" id="home">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-center flex-col w-full">
          <h1 className="text-[2.5rem] sm:text-[3rem] font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent overflow-hidden leading-[1.5em]">
            Your School Social Hub for Academic Success
          </h1>
          <p className="text-lg sm:text-xl text-(--secondary-text) mb-8 max-w-2xl mx-auto">
            Connect with peers, share knowledge, and excel in your studies with
            AI-powered tools designed for Beirut Annunciation Orthodox College
            students.
          </p>
        </div>
        <div className="flex min-[600px]:gap-8 gap-3 max-[600px]:flex-col items-center justify-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center justify-center gap-2 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-md max-[600px]:w-[75%] px-10 py-1 text-[1rem] font-bold"
            onClick={() => router.push(`/signup`)}
          >
            Get Started
            <svg
              className="w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
              fill="#ffffff"
            >
              <path d="M566.6 342.6C579.1 330.1 579.1 309.8 566.6 297.3L406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3C348.8 149.8 348.8 170.1 361.3 182.6L466.7 288L96 288C78.3 288 64 302.3 64 320C64 337.7 78.3 352 96 352L466.7 352L361.3 457.4C348.8 469.9 348.8 490.2 361.3 502.7C373.8 515.2 394.1 515.2 406.6 502.7L566.6 342.7z" />
            </svg>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="border border-(--border-color) rounded-md px-10 py-1 text-[1rem] font-bold max-[600px]:w-[75%]"
            onClick={() => router.push(`/login`)}
          >
            SignIn
          </motion.button>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <img
          src="/hero-background.jpeg"
          className="rounded-lg mx-auto max-w-200 w-5/6 shadow-xl"
          alt="Hero Image"
        />
      </motion.div>
    </div>
  );
}
function Features() {
  function Card({
    title,
    description,
    svg,
    index,
  }: {
    title: string;
    description: string;
    svg: React.ReactNode;
    index: number;
  }) {
    const [ref, inView] = useInView({
      threshold: 0.2,
    });
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.3, delay: index * 0.2 }}
        className="border w-[400px] p-2 px-4 border-(--border-color) rounded-lg flex flex-col items-center justify-center"
      >
        {svg}
        <h1 className="font-semibold text-[1.2rem]">{title}</h1>
        <p className="text-(--secondary-text)">{description}</p>
      </motion.div>
    );
  }
  const cards: Array<{
    title: string;
    description: string;
    svg: React.ReactNode;
  }> = [
    {
      title: "Social Connection",
      description:
        "Connect with classmates, share updates, and build your college community",
      svg: (
        <svg
          className="w-15 fill-[#2B7FFF]"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 640"
        >
          <path d="M320 312C386.3 312 440 258.3 440 192C440 125.7 386.3 72 320 72C253.7 72 200 125.7 200 192C200 258.3 253.7 312 320 312zM290.3 368C191.8 368 112 447.8 112 546.3C112 562.7 125.3 576 141.7 576L498.3 576C514.7 576 528 562.7 528 546.3C528 447.8 448.2 368 349.7 368L290.3 368z" />
        </svg>
      ),
    },
    {
      title: "Notes Sharing",
      description:
        "Upload and download study materials while earning points for helping others",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 640"
          className="w-15 fill-[#00C950]"
          fill="currentColor"
        >
          <path d="M192 112L304 112L304 200C304 239.8 336.2 272 376 272L464 272L464 512C464 520.8 456.8 528 448 528L192 528C183.2 528 176 520.8 176 512L176 128C176 119.2 183.2 112 192 112zM352 131.9L444.1 224L376 224C362.7 224 352 213.3 352 200L352 131.9zM192 64C156.7 64 128 92.7 128 128L128 512C128 547.3 156.7 576 192 576L448 576C483.3 576 512 547.3 512 512L512 250.5C512 233.5 505.3 217.2 493.3 205.2L370.7 82.7C358.7 70.7 342.5 64 325.5 64L192 64zM248 320C234.7 320 224 330.7 224 344C224 357.3 234.7 368 248 368L392 368C405.3 368 416 357.3 416 344C416 330.7 405.3 320 392 320L248 320zM248 416C234.7 416 224 426.7 224 440C224 453.3 234.7 464 248 464L392 464C405.3 464 416 453.3 416 440C416 426.7 405.3 416 392 416L248 416z" />
        </svg>
      ),
    },
    {
      title: "AI Study Assistant",
      description:
        "Get personalized study plans, agenda summaries, and smart study tips",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 640"
          fill="currentColor"
          className="w-15 fill-[#AD46FF]"
        >
          <path d="M352 64C352 46.3 337.7 32 320 32C302.3 32 288 46.3 288 64L288 128L192 128C139 128 96 171 96 224L96 448C96 501 139 544 192 544L448 544C501 544 544 501 544 448L544 224C544 171 501 128 448 128L352 128L352 64zM160 432C160 418.7 170.7 408 184 408L216 408C229.3 408 240 418.7 240 432C240 445.3 229.3 456 216 456L184 456C170.7 456 160 445.3 160 432zM280 432C280 418.7 290.7 408 304 408L336 408C349.3 408 360 418.7 360 432C360 445.3 349.3 456 336 456L304 456C290.7 456 280 445.3 280 432zM400 432C400 418.7 410.7 408 424 408L456 408C469.3 408 480 418.7 480 432C480 445.3 469.3 456 456 456L424 456C410.7 456 400 445.3 400 432zM224 240C250.5 240 272 261.5 272 288C272 314.5 250.5 336 224 336C197.5 336 176 314.5 176 288C176 261.5 197.5 240 224 240zM368 288C368 261.5 389.5 240 416 240C442.5 240 464 261.5 464 288C464 314.5 442.5 336 416 336C389.5 336 368 314.5 368 288zM64 288C64 270.3 49.7 256 32 256C14.3 256 0 270.3 0 288L0 384C0 401.7 14.3 416 32 416C49.7 416 64 401.7 64 384L64 288zM608 256C590.3 256 576 270.3 576 288L576 384C576 401.7 590.3 416 608 416C625.7 416 640 401.7 640 384L640 288C640 270.3 625.7 256 608 256z" />
        </svg>
      ),
    },
    {
      title: "Points And Rewards",
      description:
        "Earn points for contributions, unlock achievements, and climb the leaderboard",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 640"
          fill="currentColor"
          className="w-15 fill-[#F0B100]"
        >
          <path d="M320.3 192L235.7 51.1C229.2 40.3 215.6 36.4 204.4 42L117.8 85.3C105.9 91.2 101.1 105.6 107 117.5L176.6 256.6C146.5 290.5 128.3 335.1 128.3 384C128.3 490 214.3 576 320.3 576C426.3 576 512.3 490 512.3 384C512.3 335.1 494 290.5 464 256.6L533.6 117.5C539.5 105.6 534.7 91.2 522.9 85.3L436.2 41.9C425 36.3 411.3 40.3 404.9 51L320.3 192zM351.1 334.5C352.5 337.3 355.1 339.2 358.1 339.6L408.2 346.9C415.9 348 418.9 357.4 413.4 362.9L377.1 398.3C374.9 400.5 373.9 403.5 374.4 406.6L383 456.5C384.3 464.1 376.3 470 369.4 466.4L324.6 442.8C321.9 441.4 318.6 441.4 315.9 442.8L271.1 466.4C264.2 470 256.2 464.2 257.5 456.5L266.1 406.6C266.6 403.6 265.6 400.5 263.4 398.3L227.1 362.9C221.5 357.5 224.6 348.1 232.3 346.9L282.4 339.6C285.4 339.2 288.1 337.2 289.4 334.5L311.8 289.1C315.2 282.1 325.1 282.1 328.6 289.1L351 334.5z" />
        </svg>
      ),
    },
  ];
  return (
    <div className="text-center my-[30vh] flex flex-col gap-10">
      <div>
        <h1 className="text-[3rem] font-semibold">
          Everything You Need to Succeed
        </h1>
        <p className="text-(--secondary-text)">
          Powerful features designed to enhance your academic journey and foster
          collaboration
        </p>
      </div>
      <div className="flex justify-center flex-wrap gap-4">
        {cards.map((card, index) => (
          <Card
            key={index}
            title={card.title}
            description={card.description}
            svg={card.svg}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
function Footer() {
  const router = useRouter();
  return (
    <footer className="bg-linear-to-r from-blue-600 to-pink-600 h-[50vh] w-screen text-white flex flex-col items-center justify-center gap-6 text-center">
      <h1 className="text-[2rem] font-semibold">
        Ready To Join Your School Community?
      </h1>
      <p className="text-[1.2rem] font-medium">
        Start connecting, sharing, and achieving more with BAC Connect today.
      </p>
      <button
        onClick={() => {
          router.push("/signup");
        }}
        className="bg-white text-black text-[1.2rem] font-medium px-4 py-2 rounded"
      >
        Create Your Account
      </button>
    </footer>
  );
}
export default function Page() {
  return (
    <>
      <Nav />
      <Home />
      <Features />
      <Footer />
    </>
  );
}
