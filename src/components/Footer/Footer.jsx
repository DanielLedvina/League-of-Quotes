import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <section className="social-media">
        <img src="/images/social-media/facebook.png" alt="facebook" />
        <img src="/images/social-media/youtube.png" alt="youtube" />
        <img src="/images/social-media/twitter.png" alt="twitter" />
        <img src="/images/social-media/instagram.png" alt="instagram" />
        <img src="/images/social-media/linkedin.png" alt="linkedin" />
        <img src="/images/social-media/tik-tok.png" alt="facebook" />
      </section>
      <section className="credits">
        <a href="http://www.onlinewebfonts.com/fonts">Web Fonts</a>
        <a href="https://www.flaticon.com/free-icons/instagram-logo" title="instagram logo icons">
          Instagram logo icons created by Pixel perfect - Flaticon
        </a>
        <a href="https://www.flaticon.com/free-icons/facebook" title="facebook icons">
          Facebook icons created by Pixel perfect - Flaticon
        </a>
        <a href="https://www.flaticon.com/free-icons/youtube" title="youtube icons">
          Youtube icons created by Freepik - Flaticon
        </a>
        <a href="https://www.flaticon.com/free-icons/tiktok" title="tiktok icons">
          Tiktok icons created by Freepik - Flaticon
        </a>
        <a href="https://www.flaticon.com/free-icons/linkedin" title="linkedin icons">
          Linkedin icons created by riajulislam - Flaticon
        </a>
        <a href="https://www.flaticon.com/free-icons/twitter-x" title="twitter x icons">
          Twitter x icons created by khulqi Rosyid - Flaticon
        </a>
      </section>
    </footer>
  );
};

export default Footer;
