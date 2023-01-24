"use client";

import { useEffect } from "react";

const title = ({ title }: { title: string }) => {
   useEffect(() => {
      document.title = title;
   });

   return null;
};

const updateDocument = {
   title: title,
}

export default updateDocument;

// EXAMPLE
// <TitleUpdate title={title} />