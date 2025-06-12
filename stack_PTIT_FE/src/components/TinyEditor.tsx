import React, { useState, useRef } from 'react'
import { Editor } from '@tinymce/tinymce-react';
import { Spin } from 'antd';

interface TinyEditorProps {
  onEditorInit?: (editor: any) => void;
}

const TinyEditor: React.FC<TinyEditorProps> = ({ onEditorInit }) => {
  const [loading, setLoading] = useState(true);
  const editorRef = useRef<any>(null);

  const handleInit = (evt: any, editor: any) => {
    editorRef.current = editor;
    setLoading(false);
    if (onEditorInit) {
      onEditorInit(editor);
    }
  };

  return (
    <div className="relative">
      {loading && (
        <div className="flex justify-center items-center bg-gray-50 py-16 border rounded">
          <Spin size="large" tip="Đang tải trình soạn thảo..." />
        </div>
      )}
      {/* e4p9kddqclxlp0gg550qc9cl9unby7d5qnypw940hurkkl5n */}
      <div className={loading ? "hidden" : "block"}>
        <Editor
          onInit={handleInit}
          apiKey="e4p9kddqclxlp0gg550qc9cl9unby7d5qnypw940hurkkl5n"
          init={{
            height: 350,
            menubar: false,
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "image",
              "charmap",
              "preview",
              "anchor",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "code",
              "help",
              "wordcount",
              "codesample",
            ],
            toolbar:
              "undo redo | blocks | " +
              "bold italic forecolor | alignleft aligncenter " +
              "alignright alignjustify | bullist numlist outdent indent | " +
              "removeformat | codesample | help",
            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            codesample_languages: [
              { text: "HTML/XML", value: "markup" },
              { text: "JavaScript", value: "javascript" },
              { text: "CSS", value: "css" },
              { text: "PHP", value: "php" },
              { text: "Ruby", value: "ruby" },
              { text: "Python", value: "python" },
              { text: "Java", value: "java" },
              { text: "C", value: "c" },
              { text: "C#", value: "csharp" },
              { text: "C++", value: "cpp" },
            ],
          }}
          className="w-full"
        />
      </div>
    </div>
  );
}

export default TinyEditor;