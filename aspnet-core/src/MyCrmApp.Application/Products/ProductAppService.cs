using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using MyCrmApp.Manufacturing;

namespace MyCrmApp.Products
{
    public class ProductAppService : ApplicationService, IProductAppService
    {
        private readonly IRepository<Product, Guid> _productRepository;

        public ProductAppService(IRepository<Product, Guid> productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<PagedResultDto<ProductDto>> GetListAsync(GetProductsInput input)
        {
            var queryable = await _productRepository.GetQueryableAsync();
            
            queryable = queryable
                .WhereIf(!string.IsNullOrWhiteSpace(input.Category), x => x.Category == input.Category)
                .WhereIf(!string.IsNullOrWhiteSpace(input.Brand), x => x.Brand == input.Brand)
                .WhereIf(!string.IsNullOrWhiteSpace(input.Search), x => 
                    x.ProductName.Contains(input.Search) || 
                    x.Description.Contains(input.Search) ||
                    x.Tags.Contains(input.Search))
                .WhereIf(input.MinPrice.HasValue, x => x.SellingPrice >= input.MinPrice)
                .WhereIf(input.MaxPrice.HasValue, x => x.SellingPrice <= input.MaxPrice)
                .WhereIf(input.InStockOnly, x => x.CurrentStock > 0)
                .Where(x => x.Status == ProductStatus.Active);

            var totalCount = await queryable.CountAsync();
            
            var items = await queryable
                .OrderByDescending(x => x.CreationTime)
                .Skip(input.SkipCount)
                .Take(input.MaxResultCount)
                .ToListAsync();

            return new PagedResultDto<ProductDto>(
                totalCount,
                ObjectMapper.Map<List<Product>, List<ProductDto>>(items)
            );
        }

        public async Task<ProductDto> GetAsync(Guid id)
        {
            var product = await _productRepository.GetAsync(id);
            return ObjectMapper.Map<Product, ProductDto>(product);
        }

        public async Task<ListResultDto<ProductDto>> GetLGProductsAsync()
        {
            var queryable = await _productRepository.GetQueryableAsync();
            
            var lgProducts = await queryable
                .Where(x => x.Brand == "LG" && x.Status == ProductStatus.Active)
                .OrderByDescending(x => x.CreationTime)
                .ToListAsync();

            return new ListResultDto<ProductDto>(
                ObjectMapper.Map<List<Product>, List<ProductDto>>(lgProducts)
            );
        }

        public async Task<ListResultDto<ProductDto>> GetProductsByCategoryAsync(string category)
        {
            var queryable = await _productRepository.GetQueryableAsync();
            
            var products = await queryable
                .Where(x => x.Category == category && x.Status == ProductStatus.Active)
                .OrderByDescending(x => x.CreationTime)
                .ToListAsync();

            return new ListResultDto<ProductDto>(
                ObjectMapper.Map<List<Product>, List<ProductDto>>(products)
            );
        }

        public async Task<ListResultDto<ProductDto>> GetFeaturedProductsAsync()
        {
            var queryable = await _productRepository.GetQueryableAsync();
            
            var featuredProducts = await queryable
                .Where(x => x.Status == ProductStatus.Active && x.CurrentStock > 0)
                .OrderByDescending(x => x.SellingPrice)
                .Take(8)
                .ToListAsync();

            return new ListResultDto<ProductDto>(
                ObjectMapper.Map<List<Product>, List<ProductDto>>(featuredProducts)
            );
        }

        public async Task<ListResultDto<ProductDto>> GetLowStockProductsAsync()
        {
            var queryable = await _productRepository.GetQueryableAsync();
            
            var lowStockProducts = await queryable
                .Where(x => x.Status == ProductStatus.Active && x.CurrentStock <= x.MinimumStock)
                .OrderBy(x => x.CurrentStock)
                .ToListAsync();

            return new ListResultDto<ProductDto>(
                ObjectMapper.Map<List<Product>, List<ProductDto>>(lowStockProducts)
            );
        }

        public async Task<ProductDto> CreateAsync(CreateProductDto input)
        {
            var product = ObjectMapper.Map<CreateProductDto, Product>(input);
            product = await _productRepository.InsertAsync(product, autoSave: true);
            return ObjectMapper.Map<Product, ProductDto>(product);
        }

        public async Task<ProductDto> UpdateAsync(Guid id, UpdateProductDto input)
        {
            var product = await _productRepository.GetAsync(id);
            ObjectMapper.Map(input, product);
            product = await _productRepository.UpdateAsync(product, autoSave: true);
            return ObjectMapper.Map<Product, ProductDto>(product);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _productRepository.DeleteAsync(id);
        }

        public async Task<ListResultDto<string>> GetCategoriesAsync()
        {
            var queryable = await _productRepository.GetQueryableAsync();
            
            var categories = await queryable
                .Where(x => x.Status == ProductStatus.Active)
                .Select(x => x.Category)
                .Distinct()
                .ToListAsync();

            return new ListResultDto<string>(categories);
        }

        public async Task<ListResultDto<string>> GetBrandsAsync()
        {
            var queryable = await _productRepository.GetQueryableAsync();
            
            var brands = await queryable
                .Where(x => x.Status == ProductStatus.Active)
                .Select(x => x.Brand)
                .Distinct()
                .ToListAsync();

            return new ListResultDto<string>(brands);
        }
    }
}
