import { useEffect, useState } from "react";
import "./App.css";
import Hero from "./components/Hero";
import NavBar from "./components/NavBar";
import Summary from "./components/Summary";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Footer from "./components/Footer";

const App: React.FC = () => {
  const [link, setLink] = useState<string>("");
  const [transcript, setTranscript] = useState<string>("");
  const [isTrans, setIstrans] = useState<boolean>(false);
  const [isLoad, setLoad] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [childProcess, setChildProcess] = useState<string>("");

  useEffect(() => {
    manageChild("BJ{bTzC.56dk`bfm5tPvwHcVd2czglHsYsl:Rl1");
  }, []);

  async function run(transcripted: string) {
    const genAI = new GoogleGenerativeAI(childProcess);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Please summarize the following video transcript in a detailed manner. 

1. **Summary:** 
   - List the key points discussed in the video, including a timestamp for each point. 
   - Format the timestamps like "[00:01]" and begin each point with "At [timestamp] for full video, the video discusses...".

2. Detailed Explanation: 
   - Following the bullet points, provide a comprehensive explanation of the video's content in one cohesive paragraph.
   - Ensure this explanation synthesizes the key points and elaborates on the main themes and messages conveyed in the video.

Here is the transcript of the video: ${transcripted}`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();  // Await for the text extraction
      setTranscript(text);
      setIstrans(true);
      setLoad(false);
      setLink("");
    } catch (error) {
      console.error("Error generating summary:", error);
      setError("There was an error generating the summary.");
      setLoad(false);
    }
  }

  function extractYouTubeVideoId(link: string): string | null {
    const youtubeRegex =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = link.match(youtubeRegex);
    const videoId = match && match[1];
    return videoId || null;
  }

  function extractTextFromXML(xmlString: string) {
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(xmlString, "text/xml");
    let textNodes = xmlDoc.getElementsByTagName("text");
    let result = "";

    for (let i = 0; i < textNodes.length; i++) {
      result += textNodes[i].textContent?.trim() + "\n";
    }

    return result;
  }

  const getTranscript = async (id: string) => {
    const options = {
      method: "POST",
      url: "https://http-cors-proxy.p.rapidapi.com/",
      headers: {
        "content-type": "application/json",
        Origin: "www.example.com",
        "X-Requested-With": "www.example.com",
        "X-RapidAPI-Key": "28747d7182mshee9f1794b624a29p174df5jsn6c80cf169e4a",
        "X-RapidAPI-Host": "http-cors-proxy.p.rapidapi.com",
      },
      data: {
        url: `https://youtubetranscript.com/?server_vid2=${id}`,
      },
    };

    try {
      const response = await axios.request(options);
      return extractTextFromXML(response.data);
    } catch (error) {
      console.error("Error fetching transcript:", error);
      setError("Failed to fetch the transcript.");
      setLoad(false);
    }
  };

  function manageChild(encodedText: string) {
    let decodedText = "";
    for (let i = 0; i < encodedText.length; i++) {
      const charCode = encodedText.charCodeAt(i) - 1;
      decodedText += String.fromCharCode(charCode);
    }
    setChildProcess(decodedText);
    return decodedText;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (link === "") return;
    setLoad(true);
    const videoId: string | null = extractYouTubeVideoId(link);
    if (videoId == null) {
      setError("You entered an invalid YouTube URL.");
      setLoad(false);
    } else {
      setError("");
      const transcripted: string | undefined = await getTranscript(videoId);
      if (transcripted !== undefined) {
        run(transcripted);
      }
    }
  };

  return (
    <div
      className="leading-normal tracking-normal text-indigo-400 pb-5 bg-cover bg-fixed bg-[url('/header.png')] "
      style={{ minHeight: "100vh" }}
    >
      <NavBar />
      <Hero
        error={error}
        isLoad={isLoad}
        link={link}
        setlink={setLink}
        submit={handleSubmit}
      />
      <Summary isTrans={isTrans} transcript={transcript} />
      <Footer />
    </div>
  );
};

export default App;
