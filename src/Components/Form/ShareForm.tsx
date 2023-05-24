import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useState } from "react";
import { t } from "i18next";

export default function ShareForm(props: { formID: number }) {
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <div className="flex">
      <label>{t("shareForm")}</label>
      <CopyToClipboard
        text={`localhost:3000/form/${props.formID}`}
        onCopy={onCopy}
      >
        <button>{t("copy")}</button>
      </CopyToClipboard>
      {copied && <span>Copied!</span>}
    </div>
  );
}
