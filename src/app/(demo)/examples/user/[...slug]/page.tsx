import React from "react";

type Props = {
  params: { slug: string[] };
};

export default function User({ params }: Props) {
  return (
    <div>
      User :
      <ul>
        {params.slug.map((item) => (
          <li key={item}>User ID : {item}</li>
        ))}
      </ul>
    </div>
  );
}
