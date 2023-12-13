import { library, dom } from "@fortawesome/fontawesome-svg-core";
import {
  faBars,
  faClose,
  faGlobe,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import {
  faGithub,
  faLinkedin,
  faReact,
  faJsSquare,
  faHtml5,
  faCss3Alt,
  faSass,
  faBootstrap,
  faFigma,
  faLinux,
  faNode,
} from "@fortawesome/free-brands-svg-icons";

export function initFontAwesome() {
  library.add(
    faBars,
    faClose,
    faBootstrap,
    faCss3Alt,
    faEnvelope,
    faFigma,
    faGithub,
    faGlobe,
    faHtml5,
    faJsSquare,
    faLinkedin,
    faLinux,
    faNode
  );
  dom.watch();
}
