import React from "react";

export type WidgetProps = {
  wizardId: string;
  title?: string;
  description?: string;
  logo: string;
  chatBg?: string;
};

declare const Widget: React.FC<WidgetProps>;

export default Widget;