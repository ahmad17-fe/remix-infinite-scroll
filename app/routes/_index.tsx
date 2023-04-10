import { Button } from "@material-tailwind/react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { V2_MetaFunction } from "@remix-run/react";
import { useFetcher } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import client from "~/axios.server";
import InfiniteScroll from "~/components/InfiniteScroll";
import Loader from "~/components/Loader";

export const meta: V2_MetaFunction = () => {
  return [{ title: ENV.APP_TITLE }];
};

type Photo = {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
};

type LoaderData = {
  photos: Photo[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const page = new URL(request.url).searchParams.get("_page") || 1;
  const res = await client(`/photos?`, {
    params: {
      _page: page,
      _limit: 10,
    },
  });

  return json<LoaderData>({
    photos: res.data,
  });
};

export default function Index() {
  const { photos } = useLoaderData<LoaderData>();
  const fetcher = useFetcher<LoaderData>();

  const [page, setPage] = useState(1);
  const [datas, setDatas] = useState(photos);

  useEffect(() => {
    if (!fetcher.data || fetcher.state === "loading") {
      return;
    }

    if (fetcher.data) {
      const newItems = fetcher.data.photos;
      setDatas((prevAssets) => [...prevAssets, ...newItems]);
    }
  }, [fetcher.data, fetcher.state]);

  const loadPhotos = () => {
    const pg = page + 1;
    setPage(pg);
    const query = `/?index&_page=${pg}`;
    fetcher.load(query);
  };

  return (
    <div className="container mx-auto text-center py-4 h-[100vh] over">
      <h1 className="text-xl font-bold">Remix is cool 😎🔥</h1>
      <a
        target="_blank"
        href="https://www.material-tailwind.com/docs/react/guide/remix"
        rel="noreferrer"
      >
        <Button color="light-green" variant="gradient" className="my-4">
          Tailwind Material UI
        </Button>
      </a>
      <div className="mt-4 flex flex-wrap gap-4 justify-center">
        <InfiniteScroll
          loading={fetcher.state === "loading"}
          loadNext={loadPhotos}
          hashMore={datas.length < 500}
        >
          {datas.map((photo) => (
            <div key={photo.id} className="w-60 h-60 p-2">
              <img
                src={photo.thumbnailUrl}
                alt="thumbnail"
                className="object-cover w-full"
              />
              <p className="line-clamp-1">
                {photo.id}-{photo.title}
              </p>
            </div>
          ))}
        </InfiniteScroll>
      </div>
      <div className="fixed z-50 bottom-4 right-8 flex items-center w-12 h-12 justify-center p-2 bg-yellow-600 rounded-full drop-shadow-lg">
        {fetcher.state === "loading" ? <Loader /> : "⬇"}
      </div>
    </div>
  );
}
