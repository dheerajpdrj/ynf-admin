import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "../../typings/editor.css";

const Sow = (props: any) => {
  const { sow, setSow } = props;

  const handleSowChange = (event: any, editor: any) => {
    const data = editor.getData();
    setSow(data);
  };

  return (
    <div style={{ height: "100%" }}>
      <CKEditor editor={ClassicEditor} onChange={handleSowChange} data={sow} />
    </div>
  );
};

export default Sow;
