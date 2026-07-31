import type { ProjectMotif } from "@/lib/projects";
import styles from "./ProjectVisual.module.css";

type ProjectVisualProps = {
  detail?: boolean;
  kind: ProjectMotif;
};

function PropertyFlow() {
  return (
    <svg viewBox="0 0 480 260" role="presentation">
      <path className={styles.guide} d="M96 130H384" />
      <path className={styles.flowLine} d="M96 130H384" />
      <g className={`${styles.flowStep} ${styles.flowStepOne}`}>
        <rect x="42" y="78" width="108" height="104" rx="22" />
        <circle cx="96" cy="111" r="13" />
        <path d="M72 153c7-15 39-15 47 0" />
        <path d="M66 164h60" />
      </g>
      <g className={`${styles.flowStep} ${styles.flowStepTwo}`}>
        <rect x="186" y="60" width="108" height="140" rx="22" />
        <path d="M218 94h44M218 112h32M218 145h44M218 163h27" />
        <path className={styles.approval} d="m252 177 7 7 15-18" />
      </g>
      <g className={`${styles.flowStep} ${styles.flowStepThree}`}>
        <rect x="330" y="78" width="108" height="104" rx="22" />
        <path d="M354 126h18v31h-18zM378 108h18v49h-18zM402 92h12v65h-12z" />
      </g>
      <circle className={`${styles.packet} ${styles.packetOne}`} cx="96" cy="130" r="6" />
      <circle className={`${styles.packet} ${styles.packetTwo}`} cx="96" cy="130" r="6" />
    </svg>
  );
}

function RedBlackTree() {
  return (
    <svg viewBox="0 0 480 260" role="presentation">
      <g className={styles.treeEdges}>
        <path d="M240 61 142 130M240 61l98 69M142 130l-56 72M142 130l58 72M338 130l-58 72M338 130l56 72" />
      </g>
      <g className={`${styles.treeNode} ${styles.treeRoot}`}>
        <circle cx="240" cy="61" r="27" />
        <circle cx="240" cy="61" r="7" />
      </g>
      <g className={`${styles.treeNode} ${styles.treeRedLeft}`}>
        <circle cx="142" cy="130" r="23" />
        <circle cx="142" cy="130" r="6" />
      </g>
      <g className={`${styles.treeNode} ${styles.treeRedRight}`}>
        <circle cx="338" cy="130" r="23" />
        <circle cx="338" cy="130" r="6" />
      </g>
      <g className={`${styles.treeNode} ${styles.treeLeafOne}`}>
        <circle cx="86" cy="202" r="18" />
      </g>
      <g className={`${styles.treeNode} ${styles.treeLeafTwo}`}>
        <circle cx="200" cy="202" r="18" />
      </g>
      <g className={`${styles.treeNode} ${styles.treeLeafThree}`}>
        <circle cx="280" cy="202" r="18" />
      </g>
      <g className={`${styles.treeNode} ${styles.treeLeafFour}`}>
        <circle cx="394" cy="202" r="18" />
      </g>
      <path className={styles.treeCursor} d="m309 58 23 11-10 5-4 11z" />
    </svg>
  );
}

function QuizNetwork() {
  return (
    <svg viewBox="0 0 480 260" role="presentation">
      <path className={styles.networkLine} d="M116 132H364" />
      <g className={`${styles.player} ${styles.playerOne}`}>
        <circle cx="91" cy="105" r="22" />
        <path d="M54 171c4-32 69-32 74 0" />
        <path d="M66 197h50" />
      </g>
      <g className={`${styles.player} ${styles.playerTwo}`}>
        <circle cx="389" cy="105" r="22" />
        <path d="M352 171c4-32 69-32 74 0" />
        <path d="M364 197h50" />
      </g>
      <g className={styles.questionCard}>
        <rect x="183" y="54" width="114" height="150" rx="26" />
        <path d="M220 102c0-26 41-25 41 1 0 19-21 17-21 36" />
        <circle cx="240" cy="166" r="5" />
        <path d="M211 76h58" />
      </g>
      <g className={styles.scorePills}>
        <rect x="52" y="48" width="78" height="28" rx="14" />
        <rect x="350" y="48" width="78" height="28" rx="14" />
        <path d="M76 62h30M374 62h30" />
      </g>
      <circle className={`${styles.networkPacket} ${styles.networkPacketOne}`} cx="116" cy="132" r="7" />
      <circle className={`${styles.networkPacket} ${styles.networkPacketTwo}`} cx="116" cy="132" r="5" />
    </svg>
  );
}

function GameBoard() {
  const cells = Array.from({ length: 24 }, (_, index) => {
    const column = index % 6;
    const row = Math.floor(index / 6);

    return (
      <rect
        key={index}
        x={92 + column * 48}
        y={34 + row * 48}
        width="44"
        height="44"
        rx="8"
        className={(column + row) % 2 === 0 ? styles.boardCellAlt : undefined}
      />
    );
  });

  return (
    <svg viewBox="0 0 480 260" role="presentation">
      <g className={styles.board}>{cells}</g>
      <g className={`${styles.gamePiece} ${styles.gamePieceBlue}`}>
        <circle cx="162" cy="79" r="17" />
        <path d="M148 104h28" />
      </g>
      <g className={`${styles.gamePiece} ${styles.gamePieceRed}`}>
        <circle cx="354" cy="175" r="17" />
        <path d="M340 200h28" />
      </g>
      <path className={styles.gameRoute} d="M162 79c78 4 38 96 192 96" />
      <path className={styles.flag} d="M306 62v58m0-53 45 13-45 15" />
    </svg>
  );
}

function FinanceDashboard() {
  return (
    <svg viewBox="0 0 480 260" role="presentation">
      <g className={styles.metricCards}>
        <rect x="38" y="38" width="122" height="62" rx="17" />
        <rect x="174" y="38" width="122" height="62" rx="17" />
        <rect x="310" y="38" width="132" height="62" rx="17" />
        <path d="M58 59h35M58 78h71M194 59h35M194 78h71M330 59h35M330 78h80" />
      </g>
      <g className={styles.chartBars}>
        <rect x="50" y="178" width="30" height="42" rx="7" />
        <rect x="91" y="150" width="30" height="70" rx="7" />
        <rect x="132" y="163" width="30" height="57" rx="7" />
        <rect x="173" y="126" width="30" height="94" rx="7" />
        <rect x="214" y="139" width="30" height="81" rx="7" />
      </g>
      <path className={styles.sparkArea} d="m270 205 35-35 32 12 35-53 54-23v114H270z" />
      <path className={styles.sparkLine} d="m270 205 35-35 32 12 35-53 54-23" />
      <circle className={styles.sparkPoint} cx="372" cy="129" r="7" />
    </svg>
  );
}

const visuals: Record<ProjectMotif, () => React.ReactNode> = {
  "property-flow": PropertyFlow,
  "red-black-tree": RedBlackTree,
  "quiz-network": QuizNetwork,
  "game-board": GameBoard,
  "finance-dashboard": FinanceDashboard,
};

export default function ProjectVisual({ detail = false, kind }: ProjectVisualProps) {
  const Visual = visuals[kind];

  return (
    <div
      className={`${styles.visual} ${styles[kind]} ${detail ? styles.detail : ""}`}
      aria-hidden="true"
    >
      <span className={styles.glow} />
      <Visual />
    </div>
  );
}
