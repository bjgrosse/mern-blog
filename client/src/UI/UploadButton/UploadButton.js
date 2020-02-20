import React, { useRef } from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";

/** An MUI Button that shows the browser's select file dialog.
 * Accessibility included for keyboard nav support.
 * When files are selected, the onChange handler is called
 * with the file input's change event.
 * All extra props forwarded to the Button component.
 */
const UploadButton = ({
  id = "uploader",
  accept,
  onChange,
  multiple,
  children,
  ...props
}) => {
  const buttonRef = useRef();
  const inputRef = useRef();

  const handleClick = () => {
    buttonRef.current.click();
  };

  const handleChange = e => {
    onChange(e);
    inputRef.current.value = null;
  };
  return (
    <div>
      <>
        <input
          ref={inputRef}
          accept={accept}
          style={{ display: "none" }}
          type="file"
          id={id}
          onChange={handleChange}
          multiple={multiple}
        />
        <label ref={buttonRef} htmlFor={id} />
        <Button aria-controls={id} onClick={handleClick} {...props}>
          {children}
        </Button>
      </>
    </div>
  );
};

UploadButton.defaultProps = {
  id: "uploader"
};
UploadButton.propTypes = {
  /** the file types that should be accepted.
   *  example: image/jpeg,image/png,image/gif
   */
  accept: PropTypes.string,
  /** id for the file input element */
  id: PropTypes.string,
  /** handler for when files are selected */
  onChange: PropTypes.func,
  /** allow multiple files */
  multiple: PropTypes.bool
};

export default UploadButton;
