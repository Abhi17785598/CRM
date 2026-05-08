using System;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;

namespace MyCrmApp.Payroll.Dtos
{
    public class GetPayslipsInput : PagedAndSortedResultRequestDto
    {
        public string Sorting { get; set; } = string.Empty;
        public string Filter { get; set; } = string.Empty;
        public int SkipCount { get; set; }
        public int MaxResultCount { get; set; }
    }
}
