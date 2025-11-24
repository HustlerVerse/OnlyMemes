interface Props {
  categories: string[];
  selected: string;
  onSelect: (cat: string) => void;
}

export function CategoryPills({ categories, selected, onSelect }: Props) {
  return (
    <div className="flex space-x-2 overflow-x-auto">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-4 py-2 rounded-full ${
            selected === cat ? "bg-primary text-background" : "bg-surface"
          } hover:bg-primary transition`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
