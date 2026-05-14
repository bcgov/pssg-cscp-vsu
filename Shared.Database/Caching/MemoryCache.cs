using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;

namespace Gov.Cscp.Victims.Public.Shared.Database;

public class MemoryCache : ICache
{
    private readonly IMemoryCache _memoryCache;

    public MemoryCache(IMemoryCache memoryCache)
    {
        _memoryCache = memoryCache;
    }

    public async Task<T?> GetOrSet<T>(string key, Func<Task<T>> factory, TimeSpan expiration)
    {
        if (_memoryCache.TryGetValue(key, out T? cachedValue))
        {
            return cachedValue;
        }

        var value = await factory();
        _memoryCache.Set(key, value, expiration);
        return value;
    }
}
