import type { ProjectMotif } from "@/lib/projects";
import styles from "./ProjectVisual.module.css";

type ProjectVisualProps = {
  detail?: boolean;
  kind: ProjectMotif;
};

function PropertyBuilding() {
  const windowColumns = [
    { x: 58, width: 27 },
    { x: 183, width: 24 },
    { x: 218, width: 24 },
    { x: 333, width: 16 },
    { x: 438, width: 24 },
    { x: 548, width: 22 },
    { x: 577, width: 15 },
  ];
  const windowRows = [
    { y: 75, height: 29 },
    { y: 120, height: 29 },
    { y: 166, height: 37 },
  ];
  const balconyColumns = [
    { x: 96, width: 70 },
    { x: 254, width: 66 },
    { x: 470, width: 64 },
  ];
  const balconyRows = [
    { y: 73, height: 38 },
    { y: 117, height: 39 },
    { y: 162, height: 48 },
  ];

  return (
    <svg viewBox="0 0 640 260" role="presentation">
      <path className={styles.buildingGround} d="M26 218H614" />
      <g className={styles.propertyBuilding}>
        <path className={styles.buildingShell} d="M42 61 598 68v144H42Z" />
        <path className={styles.buildingRoofline} d="M42 61 598 68" />
        <path
          className={styles.buildingFloorLines}
          d="M42 113h312m71 0h173M42 159h312m71 0h173"
        />
        <path className={styles.buildingCore} d="M354 65 425 66v146h-71Z" />
        <path
          className={styles.buildingCoreGrid}
          d="M378 65v147m24-147v147M354 113h71M354 159h71"
        />

        <g>
          {windowColumns.flatMap((column, columnIndex) =>
            windowRows.map((row, rowIndex) => {
              const middleX = column.x + column.width / 2;
              const crossY = row.y + row.height * 0.56;

              return (
                <g
                  className={styles.buildingWindow}
                  key={`${columnIndex}-${rowIndex}`}
                >
                  <rect
                    x={column.x}
                    y={row.y}
                    width={column.width}
                    height={row.height}
                    rx="2"
                  />
                  <path
                    d={`M${middleX} ${row.y + 1}v${row.height - 2}M${column.x + 1} ${crossY}h${column.width - 2}`}
                  />
                </g>
              );
            }),
          )}
        </g>

        <g>
          {balconyColumns.flatMap((column, columnIndex) =>
            balconyRows.map((row, rowIndex) => {
              const doorWidth = (column.width - 24) / 2;
              const railY = row.y + Math.min(27, row.height - 11);
              const railDepth = row.y + row.height - railY - 2;
              const railPosts = [8, 18, 28, 38, 48, 58].filter(
                (offset) => offset < column.width - 5,
              );

              return (
                <g
                  className={styles.buildingBalcony}
                  key={`${columnIndex}-${rowIndex}`}
                >
                  <rect
                    className={styles.buildingBalconyNiche}
                    x={column.x}
                    y={row.y}
                    width={column.width}
                    height={row.height}
                    rx="2"
                  />
                  <rect
                    className={styles.buildingBalconyDoor}
                    x={column.x + 8}
                    y={row.y + 5}
                    width={doorWidth}
                    height={row.height - 8}
                    rx="1"
                  />
                  <rect
                    className={styles.buildingBalconyDoor}
                    x={column.x + 16 + doorWidth}
                    y={row.y + 5}
                    width={doorWidth}
                    height={row.height - 8}
                    rx="1"
                  />
                  {rowIndex < 2 ? (
                    <path
                      className={styles.buildingBalconyRailing}
                      d={`M${column.x + 2} ${railY}h${column.width - 4}${railPosts
                        .map(
                          (offset) =>
                            `M${column.x + offset} ${railY}v${railDepth}`,
                        )
                        .join("")}`}
                    />
                  ) : null}
                  <path
                    className={styles.buildingBalconySlab}
                    d={`M${column.x - 1} ${row.y + row.height}h${column.width + 2}`}
                  />
                  {rowIndex < 2 && (columnIndex + rowIndex) % 2 === 0 ? (
                    <path
                      className={styles.buildingBalconyPlant}
                      d={`M${column.x + column.width - 12} ${railY}v-9m0 4-5-5m5 5 5-5`}
                    />
                  ) : null}
                </g>
              );
            }),
          )}
        </g>
      </g>

      <g className={styles.buildingShrubs}>
        <circle cx="68" cy="210" r="11" />
        <circle cx="177" cy="211" r="13" />
        <circle cx="239" cy="213" r="9" />
        <circle cx="334" cy="211" r="12" />
        <circle cx="448" cy="212" r="10" />
        <circle cx="555" cy="211" r="14" />
      </g>
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

function QuizDeck() {
  return (
    <svg viewBox="0 0 480 260" role="presentation">
      <g className={`${styles.quizCard} ${styles.quizCardLeft}`}>
        <rect x="180" y="48" width="120" height="166" rx="22" />
        <path d="M219 105c0-28 43-27 43 1 0 19-22 18-22 39" />
        <circle cx="240" cy="172" r="5" />
      </g>
      <g className={`${styles.quizCard} ${styles.quizCardRight}`}>
        <rect x="180" y="48" width="120" height="166" rx="22" />
        <path d="M219 105c0-28 43-27 43 1 0 19-22 18-22 39" />
        <circle cx="240" cy="172" r="5" />
      </g>
      <g className={`${styles.quizCard} ${styles.quizCardCenter}`}>
        <rect x="180" y="48" width="120" height="166" rx="22" />
        <path d="M219 105c0-28 43-27 43 1 0 19-22 18-22 39" />
        <circle cx="240" cy="172" r="5" />
      </g>
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
  "property-building": PropertyBuilding,
  "red-black-tree": RedBlackTree,
  "quiz-deck": QuizDeck,
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
