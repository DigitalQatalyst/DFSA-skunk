import { FieldTemplateProps, ObjectFieldTemplateProps, ArrayFieldTemplateProps } from "@rjsf/utils";

export const CustomFieldTemplate = (props: FieldTemplateProps) => {
  const { id, label, required, children, errors, help, description, hidden, displayLabel } = props;
  
  if (hidden) {
    return <div className="hidden">{children}</div>;
  }
  
  return (
    <div className="mb-6">
      {displayLabel && label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {description && (
        <p className="text-sm text-gray-500 mb-2">{description}</p>
      )}
      {children}
      {errors && (
        <div className="mt-2 text-sm text-red-600">
          {errors}
        </div>
      )}
      {help && (
        <p className="mt-2 text-sm text-gray-500">{help}</p>
      )}
    </div>
  );
};

export const CustomObjectFieldTemplate = (props: ObjectFieldTemplateProps) => {
  return (
    <div className="space-y-6">
      {props.properties.map((element) => (
        <div key={element.name}>{element.content}</div>
      ))}
    </div>
  );
};

export const CustomArrayFieldTemplate = (props: ArrayFieldTemplateProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        {props.title && (
          <h3 className="text-lg font-medium text-gray-900">{props.title}</h3>
        )}
        {props.canAdd && (
          <button
            type="button"
            onClick={props.onAddClick}
            className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
          >
            Add Item
          </button>
        )}
      </div>
      {props.items.map((element) => (
        <div key={element.key} className="flex gap-2 items-start p-4 border border-gray-200 rounded-lg">
          <div className="flex-1">{element.children}</div>
          {element.hasRemove && (
            <button
              type="button"
              onClick={element.onDropIndexClick(element.index)}
              className="px-3 py-2 text-sm text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export const CustomErrorListTemplate = ({ errors }: any) => {
  if (!errors || errors.length === 0) return null;
  
  return (
    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
      <h3 className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</h3>
      <ul className="list-disc list-inside space-y-1">
        {errors.map((error: any, i: number) => (
          <li key={i} className="text-sm text-red-700">
            {error.stack}
          </li>
        ))}
      </ul>
    </div>
  );
};
