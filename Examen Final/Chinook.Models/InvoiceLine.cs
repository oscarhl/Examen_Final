using Dapper.Contrib.Extensions;

namespace Chinook.Models
{
    public class InvoiceLine
    {
        [ExplicitKey]
        public int InvoiceLineId { get; set; }
        public int InvoiceId { get; set; }
        public int TrackId { get; set; }
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
    }
}
