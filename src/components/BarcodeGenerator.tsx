import Barcode from "react-barcode";

interface BarcodeGeneratorProps {
  value: string | number;
}

export default function BarcodeGenerator({ value }: BarcodeGeneratorProps) {
  return (
    <div className="bg-white p-4 rounded-md flex justify-center items-center w-full shadow-inner mt-4">
      <Barcode
        value={String(value).padStart(5, "0")}
        format="CODE39"
        width={1.5}
        height={40}
        displayValue={false}
        background="transparent"
        lineColor="#000000"
        margin={0}
      />
    </div>
  );
}
