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
      <ellipse className={styles.quizCardShadow} cx="240" cy="225" rx="82" ry="12" />
      <g className={styles.quizFlipCard}>
        <rect
          className={styles.quizCardFrame}
          x="154"
          y="27"
          width="172"
          height="202"
          rx="25"
        />
        <g className={styles.quizCardBack}>
          <rect x="164" y="37" width="152" height="182" rx="18" />
          <path d="M211 99c0-39 59-38 59 1 0 27-30 25-30 54" />
          <circle cx="240" cy="184" r="7" />
          <path className={styles.quizBackPattern} d="m179 58 18-10m86 160 18-10" />
        </g>
        <g className={styles.quizCardFront}>
          <text className={styles.quizEyebrow} x="240" y="66" textAnchor="middle">
            QUIZ
          </text>
          <text className={styles.quizQuestion} x="240" y="113" textAnchor="middle">
            2 + 2 = ?
          </text>
          <g className={styles.quizAnswers}>
            <rect x="174" y="145" width="58" height="42" rx="12" />
            <rect x="248" y="145" width="58" height="42" rx="12" />
            <text x="203" y="172" textAnchor="middle">3</text>
            <text x="277" y="172" textAnchor="middle">4</text>
          </g>
        </g>
      </g>
    </svg>
  );
}

function GameBoard() {
  return (
    <svg viewBox="0 0 480 260" role="presentation">
      <path className={styles.gameGround} d="M43 219H437" />
      <path className={styles.captureRoute} d="M127 190C164 150 185 137 211 133M353 190c-36-40-58-53-84-57" />

      <g className={`${styles.gamePawn} ${styles.gamePawnLeft}`}>
        <circle cx="96" cy="103" r="22" />
        <path d="M77 132h38c-3 13 0 27 15 43H62c15-16 18-30 15-43Z" />
        <rect x="54" y="173" width="84" height="20" rx="9" />
        <rect x="45" y="190" width="102" height="25" rx="10" />
        <path className={styles.pawnHighlight} d="M77 145c-1 8-4 14-9 21" />
      </g>

      <g className={`${styles.gamePawn} ${styles.gamePawnRight}`}>
        <circle cx="384" cy="103" r="22" />
        <path d="M365 132h38c-3 13 0 27 15 43h-68c15-16 18-30 15-43Z" />
        <rect x="342" y="173" width="84" height="20" rx="9" />
        <rect x="333" y="190" width="102" height="25" rx="10" />
        <path className={styles.pawnHighlight} d="M365 145c-1 8-4 14-9 21" />
      </g>

      <g className={styles.gameFlag}>
        <path className={styles.flagPole} d="M185 39v178" />
        <circle className={styles.flagFinial} cx="185" cy="35" r="7" />
        <path
          className={styles.flagFabric}
          d="M190 48c37-19 73 16 116-2v85c-43 18-79-17-116 2Z"
        />
      </g>
    </svg>
  );
}

function FinanceDashboard() {
  const candles = [
    { x: 72, high: 107, low: 180, open: 133, close: 160 },
    { x: 106, high: 98, low: 166, open: 148, close: 118 },
    { x: 140, high: 111, low: 177, open: 127, close: 153 },
    { x: 174, high: 85, low: 155, open: 138, close: 104 },
    { x: 208, high: 76, low: 139, open: 112, close: 91 },
    { x: 242, high: 91, low: 154, open: 105, close: 133 },
    { x: 276, high: 66, low: 142, open: 121, close: 83 },
    { x: 310, high: 57, low: 120, open: 92, close: 72 },
    { x: 344, high: 68, low: 132, open: 79, close: 108 },
    { x: 378, high: 48, low: 116, open: 101, close: 65 },
  ];

  return (
    <svg viewBox="0 0 480 260" role="presentation">
      <rect className={styles.marketPanel} x="24" y="18" width="432" height="224" rx="22" />
      <g className={styles.marketChrome}>
        <circle cx="46" cy="39" r="4" />
        <circle cx="60" cy="39" r="4" />
        <circle cx="74" cy="39" r="4" />
        <text x="91" y="44">PORTFOLIO / EUR</text>
        <rect x="377" y="30" width="58" height="20" rx="10" />
        <text className={styles.liveLabel} x="406" y="44" textAnchor="middle">LIVE</text>
      </g>

      <g className={styles.marketGrid}>
        <path d="M47 73H433M47 111H433M47 149H433M47 187H433M47 225H433" />
        <path d="M82 62V225M150 62V225M218 62V225M286 62V225M354 62V225M422 62V225" />
      </g>

      <path
        className={styles.marketArea}
        d="M72 160 106 118 140 153 174 104 208 91 242 133 276 83 310 72 344 108 378 65 416 82V225H72Z"
      />
      <path
        className={styles.marketLine}
        d="M72 160 106 118 140 153 174 104 208 91 242 133 276 83 310 72 344 108 378 65 416 82"
      />

      <g className={styles.candlesticks}>
        {candles.map((candle) => {
          const rising = candle.close < candle.open;
          const bodyY = Math.min(candle.open, candle.close);
          const bodyHeight = Math.max(8, Math.abs(candle.close - candle.open));

          return (
            <g
              className={`${styles.candle} ${rising ? styles.candleRising : styles.candleFalling}`}
              key={candle.x}
            >
              <path d={`M${candle.x} ${candle.high}V${candle.low}`} />
              <rect x={candle.x - 6} y={bodyY} width="12" height={bodyHeight} rx="2" />
            </g>
          );
        })}
      </g>

      <path className={styles.priceGuide} d="M47 82H433" />
      <path className={styles.chartScanner} d="M69 63V224" />
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
