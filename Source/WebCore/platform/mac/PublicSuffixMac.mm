/*
 * Copyright (C) 2013 Apple Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. AND ITS CONTRIBUTORS ``AS IS''
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL APPLE INC. OR ITS CONTRIBUTORS
 * BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF
 * THE POSSIBILITY OF SUCH DAMAGE.
 */

#import "config.h"
#import "PublicSuffix.h"

#import "WebCoreSystemInterface.h"
#import "WebCoreNSURLExtras.h"

#if ENABLE(PUBLIC_SUFFIX_LIST)

@interface NSString (WebCoreNSURLExtras)
- (BOOL)_web_looksLikeIPAddress;
@end

namespace WebCore {

bool isPublicSuffix(const String& domain)
{
    return wkIsPublicSuffix(decodeHostName(domain));
}

String topPrivatelyControlledDomain(const String& domain)
{
    if (domain.isNull() || domain.isEmpty())
        return String();

    NSString *host = decodeHostName(domain);

    if ([host _web_looksLikeIPAddress])
        return domain;

    // Match the longest possible suffix.
    bool hasTopLevelDomain = false;
    NSCharacterSet *dot = [[NSCharacterSet characterSetWithCharactersInString:@"."] retain];
    NSRange nextDot = NSMakeRange(0, [host length]);
    for (NSRange previousDot = [host rangeOfCharacterFromSet:dot]; previousDot.location != NSNotFound; nextDot = previousDot, previousDot = [host rangeOfCharacterFromSet:dot options:0 range:NSMakeRange(previousDot.location + previousDot.length, [host length] - (previousDot.location + previousDot.length))]) {
        NSString *substring = [host substringFromIndex:previousDot.location + previousDot.length];
        if (wkIsPublicSuffix(substring)) {
            hasTopLevelDomain = true;
            break;
        }
    }

    [dot release];
    if (!hasTopLevelDomain)
        return String();

    if (!nextDot.location)
        return domain;

    return encodeHostName([host substringFromIndex:nextDot.location + nextDot.length]);
}

}

#endif
