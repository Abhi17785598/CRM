using System;
using System.Collections.Generic;
using AutoMapper;
using MyCrmApp.Manufacturing;

namespace MyCrmApp.Products
{
    public class ProductAutoMapperProfile : Profile
    {
        public ProductAutoMapperProfile()
        {
            CreateMap<Product, ProductDto>()
                .ForMember(dest => dest.ImageUrls, opt => opt.MapFrom(src => 
                    string.IsNullOrEmpty(src.ImageUrls) ? new List<string>() : 
                    System.Text.Json.JsonSerializer.Deserialize<List<string>>(src.ImageUrls)))
                .ForMember(dest => dest.DocumentUrls, opt => opt.MapFrom(src => 
                    string.IsNullOrEmpty(src.DocumentUrls) ? new List<string>() : 
                    System.Text.Json.JsonSerializer.Deserialize<List<string>>(src.DocumentUrls)));

            CreateMap<CreateProductDto, Product>()
                .ForMember(dest => dest.ImageUrls, opt => opt.MapFrom(src => 
                    src.ImageUrls != null ? System.Text.Json.JsonSerializer.Serialize(src.ImageUrls) : null))
                .ForMember(dest => dest.DocumentUrls, opt => opt.MapFrom(src => 
                    src.DocumentUrls != null ? System.Text.Json.JsonSerializer.Serialize(src.DocumentUrls) : null));

            CreateMap<UpdateProductDto, Product>()
                .ForMember(dest => dest.ImageUrls, opt => opt.MapFrom(src => 
                    src.ImageUrls != null ? System.Text.Json.JsonSerializer.Serialize(src.ImageUrls) : null))
                .ForMember(dest => dest.DocumentUrls, opt => opt.MapFrom(src => 
                    src.DocumentUrls != null ? System.Text.Json.JsonSerializer.Serialize(src.DocumentUrls) : null))
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}
