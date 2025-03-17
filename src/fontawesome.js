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
  faPhp,
  faWordpress,
} from "@fortawesome/free-brands-svg-icons";

export function initFontAwesome() {
  library.add(
    faReact,
    faSass,
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
    faNode,
    faPhp,
    faWordpress
  );
  dom.watch();
}
