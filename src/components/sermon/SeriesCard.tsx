import type { Series } from '../../data/sermonLoader';

interface SeriesCardProps {
  series: Series;
  onClick: () => void;
}

// Series-specific images based on name
const seriesImages: Record<string, string> = {
  'Rugăciunea Domnească - Tatăl Nostru': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdBLQ8DF-TTTmqXoYidk8Z5KlOVa8mBzLuOWI-YW0nuo9LlTzTfcSjBCiE4bqaifzpZpx4swDIRqwHAssV48w1S9YXswQLkHN8uNGSpE8bFYoxUZsocmA3RBO-vOM49yTsg8x2nBmHm1jvJQLpeHuy8WqC9ZpZfu9yabeG3j3MM_76lWPi6GUtAdjJRobTK0Uu221AAZEIjuOvnYNI9XoLeRGz0qJ2gBgCZ0yN6isEG-h8b5osfhUsEB0LVn65Nt7UkZYUYXypuRE2',
  'Cele 10 Porunci ale lui Dumnezeu': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrxfGYkpO8Nty6BU8HMTiF-5IIOI9JdPg9bvkSKLLEe-4av4X7IQ0eXjTm5SmPx9EYLknNj8prCQdMjbtb7rsppjNZKXKodk7S0iV5YsgzGxAnMMWuVIC1ch8Ic8Hi9I6Ry7J8RwabzcpUJSCi452jAOKdgXmsTQCbvt2yw302DL2UG4g-WnjyS5uq6ErijH0CFFEBkwXDKuxwcIlEqSeW6yoKDxgv9FGBORhyeYv4aEb5MNNBilKdtNI33Fh8c-p9zV0YSBGCHdde',
  'Școala de Duminică': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdssHCXdE_t6Cg9gdQ40rFFVJ1IhhwS6ICNJf5D54MDOpWTTR8_BikFrz21r5KFcZr4URRQWiNdTivtnkeyrwneKTIEQ70ahu56byJmST_87dSY3pvEfAc_cJ4yC5d0-Uo6Ao97css0UgVm44IDpb5TWbLelraZS2tSUSnB-K3gTFtfk3laPPjw-BsyU0gcbokowxDMN8cCippu64Pf1EOpFRo4a7JToFdIvtilmo_u9zwoSbT-gUzXV3MvVAldEhSbOvm3tDygkZb',
};

const defaultImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlPn82SqThmfdJV7B_sZ6mfBkziIP0t_qicFZ6Pxv1c9Otl5CjEJAajxqW1a_kyb6MNTBLVqTRpzxVD0yLPbIzsDEZwOv9PNNpXUB9tV1QTUzKiY9X72RUs0pAnoenz0rwV8AaCHb58O9uNNe1cIsqaN7EWkG4_bj-UBa6RbVLyLDZUAsr3KZmTo-DCejzmkyAw2G-X9OmGoOBNR_kj6xt2QLw_u4dzXjftGk8tdjea-e6rA6hJH97amv6edYvH-o4dNZ0l99MqoGR';

export default function SeriesCard({ series, onClick }: SeriesCardProps) {
  const image = seriesImages[series.name] || defaultImage;

  return (
    <div
      onClick={onClick}
      className="flex-none w-40 md:w-48 cursor-pointer group"
    >
      <div
        className="aspect-square rounded-xl bg-cover bg-center shadow-md relative border border-[#D4AF37]/20 mb-2 overflow-hidden"
        style={{ backgroundImage: `url("${image}")` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="flex items-center gap-1.5 text-white/90">
            <span className="material-symbols-outlined text-sm">playlist_play</span>
            <span className="text-xs font-medium">{series.sermons.length} părți</span>
          </div>
        </div>
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors flex items-center justify-center">
          <span className="material-symbols-outlined text-white/0 group-hover:text-white text-4xl transition-opacity drop-shadow-lg">
            play_circle
          </span>
        </div>
      </div>
      <p className="font-bold text-sm text-[#432818] line-clamp-2 leading-tight">
        {series.name}
      </p>
    </div>
  );
}
