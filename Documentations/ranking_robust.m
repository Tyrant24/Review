function [R,Q,CC] = ranking_robust(r)

%r(NxM) is the ranking matrix, where r(i,j) is the rank of the object j from the user i
%If the user i does not rank the object i, then r(i,j)=0
%N is the number of users, M is the number of objects
%C is the credit of users
%Q is the quality of objects
%R is the aggregated rank of objects
%It_max is the maximum time of iterations
%ep is the threshold value
%P is the preference matrices of users

[N,M]=size(r);
L=max(r,[],2);
C=ones(1,N);
It_max=10;
ep=0.0001;

P=zeros(M,M,N);
for i=1:N
    for s=1:M
        for t=1:M
            if r(i,s)<r(i,t)&r(i,s)>0
                P(s,t,i)=1;
            end
        end
    end
end

t=0;
while t<=It_max
    t=t+1;
    A=zeros(M);
    W=zeros(M);
    for s=1:M
        for t=1:M
            ss=0;
            for i=1:N
                ss=ss+C(i)*P(s,t,i);
            end
            A(s,t)=ss;
        end
    end
    for s=1:M
        for t=1:M
            if s~=t & A(s,t)+A(t,s)>0
                W(s,t)=(A(s,t)-A(t,s))/(A(s,t)+A(t,s));
            end
        end
    end
    CC=C;
    for i=1:N
        C(i)=2*sum(sum(P(:,:,i).*W))/(L(i)*(L(i)-1));
        if C(i)<0
            C(i)=0;
        end
    end
    delta=(sum((C-CC).^2))^0.5;
    if delta<=ep
        break;
    end
end

for s=1:M
    Q(s)=sum(A(s,:))-sum(A(:,s));
end

[v,index]=sort(Q,'descend');
for i=1:M
    R(index(i))=i;
end





