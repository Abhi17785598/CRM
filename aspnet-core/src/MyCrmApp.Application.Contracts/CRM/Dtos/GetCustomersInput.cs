using Volo.Abp.Application.Dtos;

namespace MyCrmApp.CRM.Dtos
{
    public class GetCustomersInput : PagedAndSortedResultRequestDto
    {
    public string Sorting { get; set; } = string.Empty;
        public string Filter { get; set; } = string.Empty;
    public int SkipCount { get; set; }
        public int MaxResultCount { get; set; }
    }
}
