import { WidgetProps } from "@rjsf/utils";
import { Upload, X, FileText } from "lucide-react";
import { useState } from "react";

export const CustomTextWidget = (props: WidgetProps) => {
  const { id, value, required, disabled, readonly, onChange, label, placeholder } = props;
  
  return (
    <input
      id={id}
      type="text"
      value={value || ""}
      required={required}
      disabled={disabled}
      readOnly={readonly}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
    />
  );
};

export const CustomTextareaWidget = (props: WidgetProps) => {
  const { id, value, required, disabled, readonly, onChange, options } = props;
  
  return (
    <textarea
      id={id}
      value={value || ""}
      required={required}
      disabled={disabled}
      readOnly={readonly}
      rows={options?.rows || 4}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
    />
  );
};

export const CustomSelectWidget = (props: WidgetProps) => {
  const { id, value, required, disabled, onChange, options } = props;
  const { enumOptions } = options;
  
  return (
    <select
      id={id}
      value={value || ""}
      required={required}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white"
    >
      <option value="">Select an option</option>
      {enumOptions?.map((option: any) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export const CustomCheckboxWidget = (props: WidgetProps) => {
  const { id, value, disabled, onChange, label } = props;
  
  return (
    <div className="flex items-start">
      <input
        id={id}
        type="checkbox"
        checked={value || false}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
      />
      <label htmlFor={id} className="ml-3 text-sm text-gray-700">
        {label}
      </label>
    </div>
  );
};

export const CustomEmailWidget = (props: WidgetProps) => {
  const { id, value, required, disabled, readonly, onChange, placeholder } = props;
  
  return (
    <input
      id={id}
      type="email"
      value={value || ""}
      required={required}
      disabled={disabled}
      readOnly={readonly}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
    />
  );
};

export const CustomNumberWidget = (props: WidgetProps) => {
  const { id, value, required, disabled, readonly, onChange, placeholder } = props;
  
  return (
    <input
      id={id}
      type="number"
      value={value || ""}
      required={required}
      disabled={disabled}
      readOnly={readonly}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
    />
  );
};

export const CustomFileWidget = (props: WidgetProps) => {
  const { id, value, required, disabled, onChange, label } = props;
  const [fileName, setFileName] = useState<string>(value || "");
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      // Store just the filename to pass validation
      onChange(file.name);
      // Dispatch custom event with actual file
      window.dispatchEvent(new CustomEvent('fileSelected', { 
        detail: { fieldId: id, file } 
      }));
    }
  };
  
  const handleClear = () => {
    setFileName("");
    onChange("");
  };
  
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className={`flex items-center justify-center w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
          disabled 
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
            : 'border-gray-300 hover:border-primary hover:bg-primary/5'
        }`}
      >
        <div className="flex items-center space-x-2 text-gray-600">
          <Upload className="w-5 h-5" />
          <span className="text-sm font-medium">
            {fileName || "Click to upload file"}
          </span>
        </div>
        <input
          id={id}
          type="file"
          required={required}
          disabled={disabled}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        />
      </label>
      
      {fileName && (
        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-700">{fileName}</span>
          </div>
          {!disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
