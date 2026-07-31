import { useEffect, useMemo, useRef, useState } from "react";
import BirthdayMessage from "./components/BirthdayMessage.jsx";
import CakeScreen from "./components/CakeScreen.jsx";
import ConfettiEffect from "./components/ConfettiEffect.jsx";
import FinalCelebration from "./components/FinalCelebration.jsx";
import MusicControl from "./components/MusicControl.jsx";
import SurpriseSection from "./components/SurpriseSection.jsx";
import WelcomeScreen from "./components/WelcomeScreen.jsx";
import { birthdayConfig } from "./data/birthdayConfig.js";
import { resolvePublicAsset } from "./utils/mediaPaths.js";

const screens = ["welcome", "message", "cake", "surprises", "final"];

export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [openedGiftIds, setOpenedGiftIds] = useState([]);
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [activeMedia, setActiveMedia] = useState(null);
  const [stopSignal, setStopSignal] = useState(0);
  const backgroundMusicRef = useRef(null);
  const cakeMusicRef = useRef(null);
  const candleCheerRef = useRef(null);
  const surpriseOpenSoundRef = useRef(null);
  const candleCheerTimerRef = useRef(null);

  const openedCount = openedGiftIds.length;
  const allGiftsOpened = openedCount === birthdayConfig.dedications.length;

  const currentStep = useMemo(() => screens.indexOf(screen) + 1, [screen]);

  useEffect(() => {
    const music = backgroundMusicRef.current;
    if (!music || !birthdayConfig.backgroundMusicPath || !musicEnabled || isMuted || activeMedia) return;

    music.volume = 0.18;
    music.loop = true;
    music.play().catch(() => setAudioReady(false));
  }, [musicEnabled, isMuted, activeMedia]);

  useEffect(() => {
    const music = backgroundMusicRef.current;
    if (!music) return;

    if (isMuted || !musicEnabled || activeMedia) {
      music.pause();
    }
  }, [isMuted, musicEnabled, activeMedia]);

  useEffect(() => {
    if (screen === "cake" && !isMuted && !candlesBlown) {
      startCakeBirthdayMusic();
      return;
    }

    stopCakeBirthdayMusic();
  }, [screen, isMuted, candlesBlown]);

  useEffect(() => {
    if (screen !== "cake") {
      stopCandleCheer();
    }
  }, [screen]);

  useEffect(() => () => stopCakeBirthdayMusic(), []);
  useEffect(() => () => stopCandleCheer(), []);

  function triggerConfetti() {
    setConfettiKey((key) => key + 1);
  }

  function startCakeBirthdayMusic({ restart = false } = {}) {
    const cakeMusic = cakeMusicRef.current;
    if (!cakeMusic || isMuted) return;

    const backgroundMusic = backgroundMusicRef.current;
    if (backgroundMusic) backgroundMusic.pause();

    cakeMusic.volume = 0.58;
    cakeMusic.loop = true;
    if (restart) cakeMusic.currentTime = 0;
    cakeMusic.play().catch(() => {});
  }

  function stopCakeBirthdayMusic({ reset = false } = {}) {
    const cakeMusic = cakeMusicRef.current;
    if (!cakeMusic) return;

    cakeMusic.pause();
    if (reset) cakeMusic.currentTime = 0;
  }

  function playCandleCheer() {
    const cheer = candleCheerRef.current;
    if (!cheer || isMuted) return;

    window.clearTimeout(candleCheerTimerRef.current);
    cheer.pause();
    cheer.currentTime = 0;
    cheer.volume = 0.85;
    cheer.play().catch(() => {});

    candleCheerTimerRef.current = window.setTimeout(() => {
      stopCandleCheer();
    }, 3000);
  }

  function playSurpriseOpenSound() {
    const sound = surpriseOpenSoundRef.current;
    if (!sound || isMuted) return;

    sound.pause();
    sound.currentTime = 0;
    sound.volume = 0.85;
    sound.play().catch(() => {});
  }

  function stopCandleCheer() {
    const cheer = candleCheerRef.current;
    window.clearTimeout(candleCheerTimerRef.current);
    candleCheerTimerRef.current = null;

    if (!cheer) return;
    cheer.pause();
    cheer.currentTime = 0;
  }

  function startExperience() {
    setMusicEnabled(true);
    setAudioReady(true);
    setScreen("message");
  }

  function blowCandles() {
    if (candlesBlown) return;

    setCandlesBlown(true);
    triggerConfetti();
    stopCakeBirthdayMusic({ reset: true });
    playCandleCheer();
  }

  function openSurprises() {
    stopCandleCheer();
    setScreen("surprises");
  }

  function openGift(id) {
    setOpenedGiftIds((ids) => {
      if (ids.includes(id)) return ids;
      setActiveMedia(null);
      setStopSignal((signal) => signal + 1);
      playSurpriseOpenSound();
      return [...ids, id];
    });
  }

  function requestMediaPlay(media) {
    const music = backgroundMusicRef.current;
    if (music) music.pause();
    setActiveMedia(media);
  }

  function stopMedia(mediaId) {
    setActiveMedia((media) => (media?.id === mediaId ? null : media));
  }

  function stopAllMedia() {
    setActiveMedia(null);
    setStopSignal((signal) => signal + 1);
    stopCakeBirthdayMusic({ reset: true });
    stopCandleCheer();
  }

  function replayExperience() {
    stopAllMedia();
    setOpenedGiftIds([]);
    setCandlesBlown(false);
    setConfettiKey((key) => key + 1);
    setScreen("welcome");
  }

  function openFinalSurprise() {
    stopAllMedia();
    triggerConfetti();
    setScreen("final");
  }

  function goBack() {
    const currentIndex = screens.indexOf(screen);
    if (currentIndex <= 0) return;

    stopAllMedia();
    setScreen(screens[currentIndex - 1]);
  }

  function toggleMute() {
    setIsMuted((muted) => !muted);
  }

  return (
    <main className="app-shell">
      <div className="ambient-layer" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

      {birthdayConfig.backgroundMusicPath && (
        <audio ref={backgroundMusicRef} src={resolvePublicAsset(birthdayConfig.backgroundMusicPath)} preload="auto" />
      )}
      <audio ref={cakeMusicRef} src={resolvePublicAsset(birthdayConfig.birthdayMusicPath)} preload="auto" />
      <audio ref={candleCheerRef} src={resolvePublicAsset(birthdayConfig.candleCheerPath)} preload="auto" />
      <audio ref={surpriseOpenSoundRef} src={resolvePublicAsset(birthdayConfig.surpriseOpenSoundPath)} preload="auto" />

      <ConfettiEffect triggerKey={confettiKey} />

      {screen !== "welcome" && (
        <MusicControl
          isMuted={isMuted}
          audioReady={audioReady}
          onToggleMute={toggleMute}
        />
      )}

      {screen !== "welcome" && (
        <button className="back-control" type="button" onClick={goBack} aria-label="Go to previous page">
          <span aria-hidden="true">‹</span>
          Back
        </button>
      )}

      <div className="screen-frame" data-step={currentStep}>
        {screen === "welcome" && (
          <WelcomeScreen config={birthdayConfig} onStart={startExperience} />
        )}

        {screen === "message" && (
          <BirthdayMessage
            config={birthdayConfig}
            onContinue={() => setScreen("cake")}
          />
        )}

        {screen === "cake" && (
          <CakeScreen
            config={birthdayConfig}
            candlesBlown={candlesBlown}
            onBlowCandles={blowCandles}
            onOpenSurprises={openSurprises}
          />
        )}

        {screen === "surprises" && (
          <SurpriseSection
            config={birthdayConfig}
            openedGiftIds={openedGiftIds}
            allGiftsOpened={allGiftsOpened}
            activeMedia={activeMedia}
            stopSignal={stopSignal}
            onOpenGift={openGift}
            onRequestMediaPlay={requestMediaPlay}
            onStopMedia={stopMedia}
            onOpenFinalSurprise={openFinalSurprise}
          />
        )}

        {screen === "final" && (
          <FinalCelebration
            config={birthdayConfig}
            onReplay={replayExperience}
            onViewSurprises={() => setScreen("surprises")}
          />
        )}
      </div>
    </main>
  );
}
