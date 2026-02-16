import type { HtmlBlock } from "./types";

export const CONTENT_BLOCKS_4: HtmlBlock[] = [
  {
    id: "video-embed",
    name: "Video Embed Placeholder",
    category: "content",
    description: "Video player placeholder with title",
    variables: ["videoTitle", "videoDescription"],
    html: `<div class="video-container">
  <h3 class="video-title">{{videoTitle}}</h3>
  <div class="video-placeholder">
    <div class="video-play-button">▶</div>
  </div>
  <p class="video-description">{{videoDescription}}</p>
</div>`,
    css: `:scope .video-container {
  max-width: 800px;
  margin: 2rem auto;
}
:scope .video-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1rem;
  text-align: center;
}
:scope .video-placeholder {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
  background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
  border-radius: 1rem;
  overflow: hidden;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
:scope .video-play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: {{brand.primaryColor}};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  cursor: pointer;
  transition: transform 0.3s;
}
:scope .video-play-button:hover {
  transform: translate(-50%, -50%) scale(1.1);
}
:scope .video-description {
  color: #6b7280;
  line-height: 1.7;
  text-align: center;
}`,
  },
];
