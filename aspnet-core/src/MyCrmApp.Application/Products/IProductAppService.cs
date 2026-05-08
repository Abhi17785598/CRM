using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace MyCrmApp.Products
{
    public interface IProductAppService : IApplicationService
    {
        Task<PagedResultDto<ProductDto>> GetListAsync(GetProductsInput input);
        Task<ProductDto> GetAsync(Guid id);
        Task<ListResultDto<ProductDto>> GetLGProductsAsync();
        Task<ListResultDto<ProductDto>> GetProductsByCategoryAsync(string category);
        Task<ListResultDto<ProductDto>> GetFeaturedProductsAsync();
        Task<ListResultDto<ProductDto>> GetLowStockProductsAsync();
        Task<ProductDto> CreateAsync(CreateProductDto input);
        Task<ProductDto> UpdateAsync(Guid id, UpdateProductDto input);
        Task DeleteAsync(Guid id);
        Task<ListResultDto<string>> GetCategoriesAsync();
        Task<ListResultDto<string>> GetBrandsAsync();
    }
}
