import LoginSound from "@/assets/sounds/login.mp3";
import success from "@/assets/sounds/success.mp3";
import error from "@/assets/sounds/error.mp3";
import warn from "@/assets/sounds/warn.mp3";
import like from "@/assets/sounds/like.mp3";
import notification from "@/assets/sounds/notification.mp3";

interface Sounds {
  login: HTMLAudioElement;
  success: HTMLAudioElement;
  error: HTMLAudioElement;
  warn: HTMLAudioElement;
  like: HTMLAudioElement;
  notification: HTMLAudioElement;
}

const sounds: Sounds = {
  login: new Audio(LoginSound),
  success: new Audio(success),
  error: new Audio(error),
  warn: new Audio(warn),
  like: new Audio(like),
  notification: new Audio(notification),
};

export default sounds;
