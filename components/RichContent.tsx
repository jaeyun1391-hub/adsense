type RichContentProps = {
  blocks: string[];
};

function renderBlock(block: string, index: number) {
  const key = `${index}-${block.slice(0, 24)}`;

  if (block.startsWith("## ")) {
    return <h2 key={key}>{block.slice(3)}</h2>;
  }

  if (block.startsWith("### ")) {
    return <h3 key={key}>{block.slice(4)}</h3>;
  }

  if (block.startsWith("- ")) {
    const items = block
      .split("\n")
      .map((line) => line.replace(/^- /, "").trim())
      .filter(Boolean);

    return (
      <ul key={key}>
        {items.map((item, itemIndex) => (
          <li key={`${itemIndex}-${item}`}>{item}</li>
        ))}
      </ul>
    );
  }

  return <p key={key}>{block}</p>;
}

export function RichContent({ blocks }: RichContentProps) {
  return <>{blocks.map((block, index) => renderBlock(block, index))}</>;
}
