import { Booking } from '@/lib/api';

interface InvoiceProps {
  booking: Booking;
}

const Invoice = ({ booking }: InvoiceProps) => {
  const checkIn = new Date(booking.checkInDate);
  const checkOut = new Date(booking.checkOutDate);
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div 
      id="invoice-capture" 
      className="bg-white text-gray-900 font-sans w-[800px] absolute -left-[9999px] top-0 p-12"
      style={{ minHeight: '1131px', boxSizing: 'border-box' }}
    >
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-jade-600 pb-8 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-jade-700 tracking-tight">Hotel Grill Durbar</h1>
          <p className="text-gray-500 mt-2 font-medium">Sauraha, Chitwan, Nepal</p>
          <p className="text-gray-500 font-medium">Phone: 056-494295</p>
          <p className="text-gray-500 font-medium">Email: info@grilldurbar.com</p>
        </div>
        <div className="text-right">
          <h2 className="text-4xl font-black text-gray-800 uppercase tracking-widest mb-2">INVOICE</h2>
          <p className="text-gray-600 font-bold mb-1">Invoice No: INV-{booking.bookingId}</p>
          <p className="text-gray-600 mb-2 font-medium">Date: {new Date().toLocaleDateString()}</p>
          <span className="inline-block px-4 py-1.5 bg-green-100 text-green-800 text-sm font-bold rounded-full border border-green-200">
            PAID
          </span>
        </div>
      </div>

      {/* Bill To & Stay Details grid */}
      <div className="grid grid-cols-2 gap-10 mb-10">
        <div>
          <h3 className="text-lg font-bold text-gray-400 uppercase tracking-wider mb-3 border-b border-gray-200 pb-2">Billed To</h3>
          <p className="font-bold text-gray-800 text-xl mb-1">{booking.guestName}</p>
          <p className="text-gray-600 font-medium mb-1">Phone: {booking.phoneNumber}</p>
          {booking.email && <p className="text-gray-600 font-medium">Email: {booking.email}</p>}
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-400 uppercase tracking-wider mb-3 border-b border-gray-200 pb-2">Stay Details</h3>
          <table className="w-full text-base">
            <tbody>
              <tr>
                <td className="py-1.5 font-bold text-gray-600 w-1/3">Check-in:</td>
                <td className="py-1.5 text-gray-800 font-medium">{checkIn.toLocaleDateString()} at 12:30 PM</td>
              </tr>
              <tr>
                <td className="py-1.5 font-bold text-gray-600">Check-out:</td>
                <td className="py-1.5 text-gray-800 font-medium">{checkOut.toLocaleDateString()} at 12:00 PM</td>
              </tr>
              <tr>
                <td className="py-1.5 font-bold text-gray-600">Duration:</td>
                <td className="py-1.5 text-gray-800 font-medium">{nights} Night({nights > 1 ? 's' : ''})</td>
              </tr>
              <tr>
                <td className="py-1.5 font-bold text-gray-600">Guests:</td>
                <td className="py-1.5 text-gray-800 font-medium">{booking.numberOfGuests} Person({booking.numberOfGuests > 1 ? 's' : ''})</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Table */}
      <table className="w-full mb-10 border-collapse">
        <thead>
          <tr className="bg-gray-100 text-gray-800 border-b-2 border-jade-600">
            <th className="py-4 px-4 font-bold text-left rounded-tl-lg">Description</th>
            <th className="py-4 px-4 font-bold text-center">Rooms</th>
            <th className="py-4 px-4 font-bold text-center">Nights</th>
            <th className="py-4 px-4 font-bold text-right rounded-tr-lg">Amount (NPR)</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-200">
            <td className="py-6 px-4">
              <p className="font-bold text-gray-800 text-lg">Standard Room Accommodation</p>
              <p className="text-gray-500 mt-1 font-medium">Includes complimentary breakfast and Wi-Fi</p>
              {booking.specialRequests ? <p className="text-gray-500 mt-2 text-sm italic">Note: {booking.specialRequests}</p> : null}
            </td>
            <td className="py-6 px-4 text-center text-gray-800 font-bold text-lg">{booking.numberOfRooms}</td>
            <td className="py-6 px-4 text-center text-gray-800 font-bold text-lg">{nights}</td>
            <td className="py-6 px-4 text-right font-bold text-gray-800 text-lg">{booking.totalAmount.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-16">
        <div className="w-1/2">
          <div className="flex justify-between py-3">
            <span className="text-gray-600 font-bold text-lg">Subtotal:</span>
            <span className="text-gray-800 font-bold text-lg">NPR {booking.totalAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-300">
            <span className="text-gray-600 font-bold text-lg">Taxes & Fees:</span>
            <span className="text-gray-800 font-bold text-lg">Included</span>
          </div>
          <div className="flex justify-between py-5 text-2xl font-black bg-jade-50 px-6 mt-4 rounded-xl border border-jade-200">
            <span className="text-jade-800">Total Paid:</span>
            <span className="text-jade-800">NPR {booking.totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-8 border-t-2 border-gray-200 text-center text-gray-500 font-medium">
        <p className="font-bold text-gray-800 text-lg mb-2">Thank you for choosing Hotel Grill Durbar!</p>
        <p>If you have any questions concerning this invoice, please contact our front desk.</p>
        <p className="mt-8 text-xs text-gray-400 italic font-normal">This is a system-generated invoice and requires no physical signature.</p>
      </div>
    </div>
  );
};

export default Invoice;
